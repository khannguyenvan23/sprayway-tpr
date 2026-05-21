import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const firebaseAuth = require("C:/Users/Admins/AppData/Roaming/npm/node_modules/firebase-tools/lib/auth.js");

const projectArg = process.argv.find((arg) => arg.startsWith("--project="));
const projectId = projectArg?.split("=")[1] || readDefaultProject();
const databaseId = "(default)";
const now = new Date().toISOString();

const catalogDir = path.join(process.cwd(), "data", "catalog");
const products = withUniqueDocumentIds(
  readJson(path.join(catalogDir, "products.json")).map(enrichProduct),
  (product) => product.slug,
);
const categories = withUniqueSlugs(
  readJson(path.join(catalogDir, "categories.json")).map((category) => ({
    ...category,
    slug: slugify(category.name),
  })),
);
const brands = withUniqueSlugs(
  readJson(path.join(catalogDir, "brands.json")).map((brand) => ({
    ...brand,
    slug: slugify(brand.name),
  })),
);

if (!projectId) {
  throw new Error("Missing Firebase project id. Pass --project=<project-id> or set .firebaserc.");
}

const account = firebaseAuth.getGlobalDefaultAccount();
if (!account?.tokens?.refresh_token) {
  throw new Error("Firebase CLI is not logged in. Run firebase login first.");
}

const token = await firebaseAuth.getAccessToken(account.tokens.refresh_token, [
  "email",
  "openid",
  "https://www.googleapis.com/auth/cloud-platform",
  "https://www.googleapis.com/auth/cloudplatformprojects.readonly",
  "https://www.googleapis.com/auth/firebase",
]);

const writes = [
  ...products.map((product) => writeDoc("products", product.firestoreId, product)),
  ...categories.map((category) => writeDoc("categories", category.slug, category)),
  ...brands.map((brand) => writeDoc("brands", brand.slug, brand)),
  writeDoc("catalogMeta", "current", {
    source: "data/catalog/products.json",
    productCount: products.length,
    categoryCount: categories.length,
    brandCount: brands.length,
    seededAt: now,
  }),
];

let written = 0;
for (const chunk of chunkArray(writes, 450)) {
  await batchWrite(chunk, token.access_token);
  written += chunk.length;
  console.log(`Seeded ${written}/${writes.length} documents`);
}

console.log(`Done. Firestore project: ${projectId}, products: ${products.length}`);

function readDefaultProject() {
  const rcPath = path.join(process.cwd(), ".firebaserc");
  if (!fs.existsSync(rcPath)) return "";
  return JSON.parse(fs.readFileSync(rcPath, "utf8"))?.projects?.default || "";
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function enrichProduct(product) {
  const imageFile = product.image?.split("/").pop() || "";
  const price = product.price || estimatePrice(product);
  const stock = product.stock ?? estimateStock(product);
  const sku = product.sku || buildSku(product);

  return {
    ...product,
    assetPath: imageFile ? `/assets/${imageFile}` : "",
    currency: product.currency || "VND",
    price,
    sku,
    stock,
    dbSource: "catalog-json",
    updatedAt: now,
  };
}

function writeDoc(collection, id, data) {
  return {
    update: {
      name: docName(collection, id),
      fields: toFirestoreFields(data),
    },
  };
}

function docName(collection, id) {
  return `projects/${projectId}/databases/${databaseId}/documents/${collection}/${encodeURIComponent(id)}`;
}

async function batchWrite(writesChunk, accessToken) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents:batchWrite`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ writes: writesChunk }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Firestore seed failed: ${response.status} ${JSON.stringify(body)}`);
  }

  const failed = body.status?.filter((status) => status.code && status.code !== 0) || [];
  if (failed.length) {
    throw new Error(`Firestore seed had ${failed.length} failed writes: ${JSON.stringify(failed.slice(0, 3))}`);
  }
}

function toFirestoreFields(value) {
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, fieldValue]) => fieldValue !== undefined)
      .map(([key, fieldValue]) => [key, toFirestoreValue(fieldValue)]),
  );
}

function toFirestoreValue(value) {
  if (value === null) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === "object") {
    return { mapValue: { fields: toFirestoreFields(value) } };
  }

  return { stringValue: String(value) };
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

function withUniqueSlugs(items) {
  const seen = new Map();

  return items.map((item) => {
    const baseSlug = item.slug || "item";
    const count = seen.get(baseSlug) || 0;
    seen.set(baseSlug, count + 1);

    if (count === 0) return item;
    return { ...item, slug: `${baseSlug}-${count + 1}` };
  });
}

function withUniqueDocumentIds(items, getBaseId) {
  const seen = new Map();

  return items.map((item) => {
    const baseId = getBaseId(item) || "item";
    const count = seen.get(baseId) || 0;
    seen.set(baseId, count + 1);

    return {
      ...item,
      firestoreId: count === 0 ? baseId : `${baseId}-${count + 1}`,
    };
  });
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
