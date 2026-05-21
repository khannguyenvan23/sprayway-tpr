import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { normalizeBrandRow, normalizeCategoryRow, normalizeProductRow } from "@/lib/supabase-data";

const catalogPath = path.join(process.cwd(), "data", "catalog", "products.json");
const categoriesPath = path.join(process.cwd(), "data", "catalog", "categories.json");
const brandsPath = path.join(process.cwd(), "data", "catalog", "brands.json");

let catalogPromise;

export async function getCatalog() {
  if (!catalogPromise) {
    catalogPromise = loadCatalog();
  }

  return catalogPromise;
}

export async function getProductBySlug(slug) {
  const { products } = await getCatalog();
  return products.find((product) => product.slug === slug);
}

export async function getFeaturedProducts(limit = 12) {
  const { products } = await getCatalog();
  return products.filter((product) => product.featured).slice(0, limit);
}

async function loadCatalog() {
  if (process.env.CATALOG_SOURCE === "json") {
    return loadJsonCatalog();
  }

  try {
    const catalog = await loadSupabaseCatalog();
    console.log(`Catalog source: Supabase (${catalog.products.length} products)`);
    return catalog;
  } catch (error) {
    console.warn(`Supabase catalog unavailable, falling back to JSON: ${error.message}`);
    return loadJsonCatalog();
  }
}

function loadJsonCatalog() {
  const products = JSON.parse(fs.readFileSync(catalogPath, "utf8")).map(withCommerceDefaults);
  const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf8"));
  const brands = JSON.parse(fs.readFileSync(brandsPath, "utf8"));
  return { products, categories, brands, source: "json" };
}

async function loadSupabaseCatalog() {
  const supabase = createPublicSupabaseClient();
  const [productsResult, categoriesResult, brandsResult] = await Promise.all([
    supabase.from("products").select("*, brands(name,slug), categories(name,slug)").eq("status", "active").order("name", { ascending: true }),
    supabase.from("categories").select("*").order("name", { ascending: true }),
    supabase.from("brands").select("*").order("name", { ascending: true }),
  ]);

  if (productsResult.error) throw productsResult.error;
  if (categoriesResult.error) throw categoriesResult.error;
  if (brandsResult.error) throw brandsResult.error;

  const categories = categoriesResult.data || [];
  const brands = brandsResult.data || [];

  return {
    products: (productsResult.data || []).map(normalizeProductRow).map(withCommerceDefaults),
    categories: categories.map((category) => normalizeCategoryRow(category, 0)),
    brands: brands.map((brand) => normalizeBrandRow(brand, 0)),
    source: "supabase",
  };
}

function withCommerceDefaults(product) {
  return {
    ...product,
    currency: product.currency || "VND",
    price: product.price || estimatePrice(product),
    sku: product.sku || buildSku(product),
    stock: product.stock ?? estimateStock(product),
  };
}

function buildSku(product) {
  const brand = String(product.brand || "SPW")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 4)
    .toUpperCase() || "SPW";
  const code = String(product.code || product.id || "000").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return `${brand}-${code.padStart(3, "0")}`;
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

function createPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase public credentials.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
