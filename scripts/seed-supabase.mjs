import { readFile } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!baseUrl || !serviceKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.",
  );
}

const catalogDir = path.join(process.cwd(), "data", "catalog");
const products = JSON.parse(await readFile(path.join(catalogDir, "products.json"), "utf8"));
const brands = JSON.parse(await readFile(path.join(catalogDir, "brands.json"), "utf8"));
const categories = JSON.parse(await readFile(path.join(catalogDir, "categories.json"), "utf8"));
const now = new Date().toISOString();

const normalizedBrands = uniqueBySlug(
  brands.map((brand) => ({
    name: String(brand.name || "").trim(),
    slug: slugify(brand.name),
    description: "",
    updated_at: now,
  })),
);

const normalizedCategories = uniqueBySlug(
  categories.map((category) => ({
    name: String(category.name || "").trim(),
    slug: slugify(category.name),
    description: "",
    updated_at: now,
  })),
);

const brandRows = await upsertAndReturn("brands", normalizedBrands);
const categoryRows = await upsertAndReturn("categories", normalizedCategories);
const brandBySlug = new Map(brandRows.map((row) => [row.slug, row]));
const categoryBySlug = new Map(categoryRows.map((row) => [row.slug, row]));

const productRows = products.map((product) => {
  const brandName = String(product.brand || "").trim();
  const categoryName = String(product.category || "").trim();
  const brandSlug = slugify(brandName);
  const categorySlug = slugify(categoryName);
  const price = estimatePrice(product);
  const stock = estimateStock(product);
  const sku = buildSku(product);
  const imageUrl = normalizeImageUrl(product);

  return {
    slug: String(product.slug || "").trim(),
    name: String(product.name || "").trim(),
    sku,
    brand_id: brandBySlug.get(brandSlug)?.id || null,
    category_id: categoryBySlug.get(categorySlug)?.id || null,
    price,
    compare_at_price: null,
    stock,
    status: "active",
    featured: Boolean(product.featured),
    short_description: cleanText(product.shortDescription || ""),
    description: cleanText(product.fullDescription || ""),
    image_url: imageUrl,
    gallery: buildGallery(product),
    metadata: {
      source_id: product.id || null,
      code: product.code || null,
      brand: brandName || null,
      category: categoryName || null,
      applications: product.applications || [],
      source_url: product.sourceUrl || null,
      source_status: product.status || null,
      search_text: product.searchText || null,
      original_name: product.originalName || null,
      import_source: "data/catalog/products.json",
      imported_at: now,
    },
    updated_at: now,
  };
});

const uniqueProductRows = uniqueBySlug(productRows);
const returnedProducts = await upsertAndReturn("products", uniqueProductRows);

console.log(`Seeded brands: ${brandRows.length}`);
console.log(`Seeded categories: ${categoryRows.length}`);
console.log(`Seeded products: ${returnedProducts.length}`);

function uniqueBySlug(items) {
  const seen = new Map();
  return items.filter((item) => {
    const slug = item.slug || "";
    if (!slug) return false;
    if (seen.has(slug)) return false;
    seen.set(slug, true);
    return true;
  });
}

async function upsertAndReturn(table, rows) {
  if (!rows.length) return [];

  const url = new URL(`${baseUrl}/rest/v1/${table}`);
  url.searchParams.set("on_conflict", "slug");
  url.searchParams.set("select", "*");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(rows),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Supabase seed failed for ${table}: ${response.status} ${body}`);
  }

  return body ? JSON.parse(body) : [];
}

function slugify(value) {
  const slug = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || `item-${Date.now()}`;
}

function cleanText(value) {
  return String(value || "")
    .replace(/\r/g, "")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .trim();
}

function buildSku(product) {
  const brand = String(product.brand || "SPW")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 4)
    .toUpperCase() || "SPW";
  const code = String(product.code || product.id || "000")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 8);
  const source = String(product.id || product.slug || "000")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(-6);
  return `${brand}-${code.padStart(3, "0")}-${source}`;
}

function estimatePrice(product) {
  const brandBase = {
    Sprayway: 185000,
    "Sprayway Singapore": 165000,
    TPR: 145000,
    LDH: 98000,
    ANC: 125000,
    Rarosa: 85000,
    Sanme: 75000,
    Rabbitchalk: 55000,
  };
  const base = brandBase[product.brand] || 89000;
  const numericCode = Number(String(product.code || product.id || 0).replace(/\D/g, "")) || Number(product.id || 1);
  return base + (numericCode % 7) * 10000;
}

function estimateStock(product) {
  const seed = Number(product.id || 1);
  if (product.status && product.status !== "needs_review") return 0;
  return 12 + (seed % 9) * 6;
}

function buildGallery(product) {
  return (product.images || []).slice(0, 8).map((image) => image.url).filter(Boolean);
}

function normalizeImageUrl(product) {
  const gallery = buildGallery(product);
  return gallery[0] || "";
}
