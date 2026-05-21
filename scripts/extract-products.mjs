import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const crawlDir = process.argv[2] || "data/crawl";
const outDir = process.argv[3] || "data/processed";

await mkdir(outDir, { recursive: true });

const pages = JSON.parse(await readFile(path.join(crawlDir, "pages.json"), "utf8"));
const assets = JSON.parse(await readFile(path.join(crawlDir, "assets.json"), "utf8"));
const assetByUrl = new Map(assets.map((asset) => [asset.url, asset]));

const productPages = pages
  .filter((page) => /\/vn\/san-pham\/\d+\//.test(page.url))
  .sort((a, b) => getProductId(a.url) - getProductId(b.url));

const products = await Promise.all(productPages.map(async (page) => {
  const html = await readFile(path.join(crawlDir, "html", page.htmlFile), "utf8");
  const fullDescription = extractProductDescription(html);
  const headings = page.headings.map((heading) => heading.text).filter(Boolean);
  const meaningfulHeadings = headings.filter((text) => !["Sản phẩm cùng loại", "Video"].includes(text));
  const category = meaningfulHeadings[0] || "";
  const name = meaningfulHeadings[1] || page.title || "";
  const brandHeading = meaningfulHeadings.slice(2).find((text) => !isLikelyProductName(text)) || "";
  const brand = inferBrand(category, brandHeading, name, page.title);
  const productImages = page.images
    .filter((image) => /\/vnt_upload\/product\//.test(image.src))
    .filter((image) => !/\/category\//.test(image.src))
    .map((image) => ({
      url: image.src,
      alt: image.alt,
      localFile: assetByUrl.get(image.src)?.localFile || "",
    }));
  const applications = extractApplications(html);

  return {
    id: getProductId(page.url),
    slug: getSlug(page.url),
    url: page.url,
    name: normalizeTitle(name),
    originalTitle: page.title,
    brand,
    category: normalizeTitle(category),
    description: fullDescription || page.description || "",
    metaDescription: page.description || "",
    fullDescription,
    applications,
    image: productImages[0]?.localFile || "",
    imageUrl: productImages[0]?.url || "",
    images: uniqueBy(productImages, "url"),
    headings: meaningfulHeadings,
    text: page.text,
  };
}));

await writeFile(path.join(outDir, "products.json"), JSON.stringify(products, null, 2), "utf8");
await writeFile(path.join(outDir, "products.csv"), toCsv(products.map(productToCsvRow)), "utf8");

const categories = summarize(products, "category");
const brands = summarize(products, "brand");

await writeFile(path.join(outDir, "categories.json"), JSON.stringify(categories, null, 2), "utf8");
await writeFile(path.join(outDir, "brands.json"), JSON.stringify(brands, null, 2), "utf8");

console.log(`Products: ${products.length}`);
console.log(`Brands: ${brands.length}`);
console.log(`Categories: ${categories.length}`);
console.log(`Output: ${path.resolve(outDir)}`);

function getProductId(url) {
  return Number(url.match(/\/vn\/san-pham\/(\d+)\//)?.[1] || 0);
}

function getSlug(url) {
  const part = decodeURIComponent(url.split("/").pop() || "");
  return part.replace(/\.html$/i, "");
}

function inferBrand(category, brandHeading, name, title) {
  const haystack = `${category} ${brandHeading} ${name} ${title}`.toLowerCase();
  const brands = [
    "Sprayway Singapore",
    "Sprayway",
    "TPR",
    "ANC",
    "Rarosa",
    "Cerliani",
    "SS-JJW",
    "Rabbitchalk",
    "LDH",
    "Sanme",
    "JS",
    "Kingmu",
    "Cxada",
  ];

  for (const brand of brands) {
    if (haystack.includes(brand.toLowerCase())) return brand;
  }

  return normalizeTitle(brandHeading || category || "Khác");
}

function isLikelyProductName(value) {
  return /\d{2,}|-|chai|keo|xịt|dầu|silicone|cleaner|adhesive|kéo|phấn|máy/i.test(value);
}

function extractProductDescription(html) {
  const tabMatch = html.match(/<div\s+class=["']tab["']\s+id=["']tab1["'][^>]*>([\s\S]*?)<\/div>\s*<div\s+class=["']tab["']\s+id=["']tab2["']/i);
  if (!tabMatch) return "";
  return cleanRichText(tabMatch[1]);
}

function extractApplications(html) {
  const matches = [...html.matchAll(/<a\s+href=["'][^"']*\/vn\/san-pham\/[^"']*["'][^>]*title=["']([^"']+)["'][^>]*>\s*<img\s+[^>]*product\/category\/cat\d+\.png/gi)];
  return uniqueBy(matches.map((match) => normalizeTitle(decodeEntities(match[1]))));
}

function cleanRichText(html) {
  return decodeEntities(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<img\b[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function normalizeTitle(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\s+-\s+/g, " - ")
    .trim();
}

function decodeEntities(value) {
  const named = {
    nbsp: " ",
    amp: "&",
    quot: "\"",
    apos: "'",
    "#39": "'",
    lt: "<",
    gt: ">",
    ndash: "-",
    mdash: "-",
    bull: "•",
    times: "x",
    Agrave: "À",
    Aacute: "Á",
    Acirc: "Â",
    Atilde: "Ã",
    Egrave: "È",
    Eacute: "É",
    Ecirc: "Ê",
    Igrave: "Ì",
    Iacute: "Í",
    Ograve: "Ò",
    Oacute: "Ó",
    Ocirc: "Ô",
    Otilde: "Õ",
    Ugrave: "Ù",
    Uacute: "Ú",
    Yacute: "Ý",
    agrave: "à",
    aacute: "á",
    acirc: "â",
    atilde: "ã",
    egrave: "è",
    eacute: "é",
    ecirc: "ê",
    igrave: "ì",
    iacute: "í",
    ograve: "ò",
    oacute: "ó",
    ocirc: "ô",
    otilde: "õ",
    ugrave: "ù",
    uacute: "ú",
    yacute: "ý",
  };

  return String(value || "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&([a-zA-Z0-9#]+);/g, (match, entity) => named[entity] ?? match);
}

function uniqueBy(items, key) {
  const seen = new Set();
  return items.filter((item) => {
    const value = typeof item === "object" ? item[key] : item;
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
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
    name: product.name,
    brand: product.brand,
    category: product.category,
    description: product.description,
    full_description: product.fullDescription,
    image: product.image,
    image_url: product.imageUrl,
    source_url: product.url,
  };
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
  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }
  return text;
}
