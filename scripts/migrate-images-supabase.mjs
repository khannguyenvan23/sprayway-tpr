import { readFile } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = "product-images";

if (!supabaseUrl || !serviceKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

await ensureBucket(bucketName);

const catalogPath = path.join(process.cwd(), "data", "catalog", "products.json");
const products = JSON.parse(await readFile(catalogPath, "utf8"));
const now = new Date().toISOString();

let updated = 0;
for (const product of products) {
  const assets = collectLocalAssets(product);
  if (!assets.length) continue;

  const uploadedUrls = [];
  for (const assetPath of assets) {
    const fileName = path.basename(assetPath);
    const objectPath = `products/${product.slug}/${fileName}`;
    const publicUrl = await uploadAsset(bucketName, objectPath, assetPath);
    uploadedUrls.push(publicUrl);
  }

  const { error } = await supabase
    .from("products")
    .update({
      image_url: uploadedUrls[0] || null,
      gallery: uploadedUrls,
      updated_at: now,
    })
    .eq("slug", product.slug);

  if (error) {
    throw error;
  }

  updated += 1;
  console.log(`Updated ${product.slug} -> ${uploadedUrls.length} images`);
}

console.log(`Done. Updated ${updated} product images.`);

async function ensureBucket(name) {
  const { data, error } = await supabase.storage.getBucket(name);
  if (!error && data) return data;

  const { error: createError } = await supabase.storage.createBucket(name, {
    public: true,
  });

  if (createError && !String(createError.message || "").toLowerCase().includes("already exists")) {
    throw createError;
  }
}

async function uploadAsset(bucket, objectPath, assetPath) {
  const buffer = await readBinary(assetPath);
  const contentType = guessContentType(assetPath);

  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

function collectLocalAssets(product) {
  const values = [];
  if (product.image) values.push(product.image);
  for (const item of product.images || []) {
    if (item?.localFile) values.push(item.localFile);
    else if (item?.url) values.push(item.url);
  }

  const seen = new Set();
  return values
    .map((value) => resolveLocalAsset(value))
    .filter(Boolean)
    .filter((value) => {
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
}

function resolveLocalAsset(imageValue) {
  if (!imageValue) return "";

  const normalized = String(imageValue).replaceAll("\\", "/");
  const fileName = normalized.split("/").pop();
  const candidates = [
    path.join(process.cwd(), normalized),
    path.join(process.cwd(), "data", "crawl", "assets", fileName),
    path.join(process.cwd(), "public", "assets", fileName),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) || "";
}

async function readBinary(filePath) {
  return await fs.promises.readFile(filePath);
}

function guessContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };
  return types[ext] || "application/octet-stream";
}
