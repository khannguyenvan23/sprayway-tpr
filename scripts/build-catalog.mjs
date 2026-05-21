import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceFile = process.argv[2] || "data/processed/products.json";
const outDir = process.argv[3] || "data/catalog";

await mkdir(outDir, { recursive: true });

const products = JSON.parse(await readFile(sourceFile, "utf8"));

const catalogProducts = products.map((product) => {
  const code = extractCode(product.name, product.originalTitle);
  const brand = normalizeBrand(product.brand, product.name);
  const category = normalizeCategory(product.category, brand, product.name);
  const displayName = normalizeProductName(product.name);
  const fullDescription = cleanLongDescription(product.fullDescription || product.description);
  const shortSource = product.metaDescription?.includes("...") ? fullDescription : product.metaDescription;
  const shortDescription = cleanDescription(shortSource || product.description || fullDescription);
  const slug = createSlug(displayName || `${code || product.id}-${product.id}`);
  const searchText = [
    displayName,
    code,
    brand,
    category,
    ...(product.applications || []),
    shortDescription,
    fullDescription,
    product.url,
  ].filter(Boolean).join(" ");

  return {
    id: String(product.id),
    code,
    slug,
    name: displayName,
    originalName: product.name,
    brand,
    category,
    applications: product.applications || [],
    shortDescription,
    fullDescription,
    image: product.image ? `data/crawl/${product.image}` : "",
    sourceUrl: product.url,
    status: "needs_review",
    featured: isLikelyFeatured(product),
    searchText: normalizeWhitespace(searchText),
    images: product.images.map((image) => ({
      url: image.url,
      localFile: image.localFile ? `data/crawl/${image.localFile}` : "",
    })),
    dataIssues: auditProduct({
      ...product,
      code,
      normalizedBrand: brand,
      normalizedCategory: category,
      normalizedName: displayName,
    }),
  };
});

const brands = summarize(catalogProducts, "brand");
const categories = summarize(catalogProducts, "category");
const issues = catalogProducts.flatMap((product) =>
  product.dataIssues.map((issue) => ({
    id: product.id,
    code: product.code,
    name: product.name,
    brand: product.brand,
    category: product.category,
    issue,
    sourceUrl: product.sourceUrl,
  })),
);

await writeFile(path.join(outDir, "products.json"), JSON.stringify(catalogProducts, null, 2), "utf8");
await writeFile(path.join(outDir, "products.csv"), toCsv(catalogProducts.map(productToCsvRow)), "utf8");
await writeFile(path.join(outDir, "brands.json"), JSON.stringify(brands, null, 2), "utf8");
await writeFile(path.join(outDir, "categories.json"), JSON.stringify(categories, null, 2), "utf8");
await writeFile(path.join(outDir, "data-issues.csv"), toCsv(issues), "utf8");
await writeFile(path.join(outDir, "summary.json"), JSON.stringify({
  products: catalogProducts.length,
  brands: brands.length,
  categories: categories.length,
  productsNeedingReview: catalogProducts.filter((product) => product.dataIssues.length).length,
  issues: issues.length,
  featured: catalogProducts.filter((product) => product.featured).length,
}, null, 2), "utf8");

console.log(`Products: ${catalogProducts.length}`);
console.log(`Brands: ${brands.length}`);
console.log(`Categories: ${categories.length}`);
console.log(`Products needing review: ${catalogProducts.filter((product) => product.dataIssues.length).length}`);
console.log(`Issues: ${issues.length}`);
console.log(`Output: ${path.resolve(outDir)}`);

function extractCode(...values) {
  const text = values.filter(Boolean).join(" ");
  const patterns = [
    /\b(?:SW|SS|TPR|LDH|JJW|US)\s*[-]?\s*[A-Z]?\d{2,4}[A-Z]?\b/i,
    /\b\d{2,4}[A-Z]?\b/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].replace(/\s+/g, "").toUpperCase();
  }
  return "";
}

function normalizeBrand(brand, name) {
  const text = `${brand} ${name}`.toLowerCase();
  const rules = [
    ["sprayway singapore", "Sprayway Singapore"],
    ["sprayway", "Sprayway"],
    ["tpr", "TPR"],
    ["anc", "ANC"],
    ["rarosa", "Rarosa"],
    ["cerliani", "Cerliani"],
    ["ss-jjw", "SS-JJW"],
    ["jjw", "SS-JJW"],
    ["rabbitchalk", "Rabbitchalk"],
    ["ldh", "LDH"],
    ["sanme", "Sanme"],
    ["kingmu", "Kingmu"],
    ["cx ada", "CX ADA"],
    ["cxada", "CX ADA"],
    ["js", "JS"],
  ];

  for (const [needle, normalized] of rules) {
    if (text.includes(needle)) return normalized;
  }

  return titleCase(brand || "Khác");
}

function normalizeCategory(category, brand, name) {
  const text = normalizeWhitespace(category).toLowerCase();
  const combined = `${text} ${name.toLowerCase()}`;

  const rules = [
    [/sprayway singapore/, "Bình xịt Sprayway Singapore"],
    [/sản phẩm sprayway|sprayway/, "Bình xịt công nghiệp Sprayway"],
    [/sản phẩm tpr|tpr/, "Keo xịt và hóa chất TPR"],
    [/may mặc|in lưới|vải|chỉ/, "Vật tư ngành may"],
    [/kéo cắt vải/, "Kéo cắt vải"],
    [/kéo cắt chỉ/, "Kéo cắt chỉ"],
    [/ổ chao|chao/, "Ổ chao"],
    [/máy cắt chỉ/, "Máy cắt chỉ"],
    [/súng hút|súng thổi|thiết bị hút bụi/, "Thiết bị khí nén"],
    [/phấn may/, "Phấn may"],
    [/nước bắn tẩy|súng bắn tẩy/, "Tẩy vết bẩn ngành may"],
    [/gia dụng|nội thất/, "Gia dụng và nội thất"],
  ];

  for (const [pattern, normalized] of rules) {
    if (pattern.test(combined)) return normalized;
  }

  if (brand === "Sprayway") return "Bình xịt công nghiệp Sprayway";
  if (brand === "TPR") return "Keo xịt và hóa chất TPR";
  if (["LDH", "Cerliani", "Sanme", "JS"].includes(brand)) return "Vật tư ngành may";
  return titleCase(category || "Khác");
}

function normalizeProductName(name) {
  return normalizeWhitespace(name)
    .replace(/\s*-\s*/g, " - ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/chiệu/gi, "chịu")
    .replace(/dat biet/gi, "đặc biệt");
}

function cleanDescription(description) {
  const text = normalizeWhitespace(description);
  if (!text || text.length < 8) return "";
  return text.length > 220 ? `${text.slice(0, 217).trim()}...` : text;
}

function cleanLongDescription(description) {
  return String(description || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean)
    .join("\n");
}

function isLikelyFeatured(product) {
  const text = `${product.name} ${product.title || ""}`.toLowerCase();
  return /\b(031|040|048|077|082|084|384|822|824|828|831|833|945)\b/.test(text)
    || /pull out|silicone|keo|lau kính|tẩy/.test(text);
}

function auditProduct(product) {
  const issues = [];
  const combined = `${product.normalizedName} ${product.category} ${product.brand}`;

  if (!product.code) issues.push("missing_code");
  if (!product.image) issues.push("missing_image");
  if (!product.description || product.description.length < 8) issues.push("weak_description");
  if (product.normalizedName.length > 85) issues.push("name_too_long");
  if (/(?:Ã.|Æ.|Ä.|áº.|á».|�)/.test(combined)) issues.push("possible_encoding_issue");
  if (/\d{2,}/.test(product.category) || product.category.length > 45) issues.push("category_may_be_product_name");
  if (["Khác", "Thương hiệu"].includes(product.normalizedBrand)) issues.push("brand_needs_review");
  return issues;
}

function summarize(products, key) {
  const counts = new Map();
  for (const product of products) {
    const value = product[key] || "Khác";
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function productToCsvRow(product) {
  return {
    id: product.id,
    code: product.code,
    name: product.name,
    brand: product.brand,
    category: product.category,
    applications: product.applications.join("|"),
    short_description: product.shortDescription,
    full_description: product.fullDescription,
    image: product.image,
    featured: product.featured,
    status: product.status,
    issues: product.dataIssues.join("|"),
    source_url: product.sourceUrl,
  };
}

function createSlug(value) {
  return removeVietnamese(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function removeVietnamese(value) {
  return normalizeWhitespace(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function titleCase(value) {
  return normalizeWhitespace(value).toLowerCase().replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvCell(row[header])).join(","));
  }
  return `\uFEFF${lines.join("\n")}\n`;
}

function csvCell(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}
