import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const startUrl = process.argv[2] || "https://sprayway-tpr.com/vn/trang-chu.html";
const outDir = process.argv[3] || "data/crawl";
const maxPages = Number(process.env.CRAWL_MAX_PAGES || 1000);
const downloadAssets = process.env.CRAWL_DOWNLOAD_ASSETS !== "0";

const start = new URL(startUrl);
const queue = [normalizeUrl(start.href)];
const queued = new Set(queue);
const visited = new Set();
const pages = [];
const assets = new Map();
const failures = [];

await mkdir(path.join(outDir, "html"), { recursive: true });
await mkdir(path.join(outDir, "assets"), { recursive: true });

while (queue.length && visited.size < maxPages) {
  const current = queue.shift();
  if (!current || visited.has(current)) continue;
  visited.add(current);

  try {
    console.log(`[page ${visited.size}] ${current}`);
    const response = await fetch(current, {
      headers: {
        "user-agent": "Mozilla/5.0 compatible; SpraywayDataCrawler/1.0",
      },
    });

    const contentType = response.headers.get("content-type") || "";
    if (!response.ok) {
      failures.push({ url: current, status: response.status, error: response.statusText });
      continue;
    }

    if (!contentType.includes("text/html")) {
      assets.set(current, { url: current, sourcePage: null, type: contentType });
      continue;
    }

    const html = await response.text();
    const htmlFile = `${hash(current)}.html`;
    await writeFile(path.join(outDir, "html", htmlFile), html, "utf8");

    const page = extractPage(current, html, htmlFile);
    pages.push(page);

    for (const link of page.links) {
      if (isCrawlablePage(link.href, start)) {
        const normalized = normalizeUrl(link.href);
        if (!queued.has(normalized) && !visited.has(normalized)) {
          queued.add(normalized);
          queue.push(normalized);
        }
      } else if (isSameHost(link.href, start)) {
        assets.set(link.href, { url: link.href, sourcePage: current, type: "link" });
      }
    }

    for (const image of page.images) {
      if (isSameHost(image.src, start)) {
        assets.set(image.src, { ...image, url: image.src, sourcePage: current, type: "image" });
      }
    }
  } catch (error) {
    failures.push({ url: current, error: error.message });
  }
}

const assetList = Array.from(assets.values());
if (downloadAssets) {
  for (let index = 0; index < assetList.length; index += 1) {
    const asset = assetList[index];
    if (asset.type !== "image") continue;
    try {
      const url = new URL(asset.url);
      const extension = path.extname(url.pathname) || ".bin";
      const assetFile = `${hash(asset.url)}${extension}`;
      console.log(`[asset ${index + 1}/${assetList.length}] ${asset.url}`);
      const response = await fetch(asset.url);
      if (!response.ok) {
        asset.downloadError = `${response.status} ${response.statusText}`;
        continue;
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      await writeFile(path.join(outDir, "assets", assetFile), bytes);
      asset.localFile = path.join("assets", assetFile).replaceAll("\\", "/");
      asset.bytes = bytes.length;
    } catch (error) {
      asset.downloadError = error.message;
    }
  }
}

await writeFile(path.join(outDir, "pages.json"), JSON.stringify(pages, null, 2), "utf8");
await writeFile(path.join(outDir, "assets.json"), JSON.stringify(assetList, null, 2), "utf8");
await writeFile(path.join(outDir, "failures.json"), JSON.stringify(failures, null, 2), "utf8");
await writeFile(path.join(outDir, "pages.csv"), toCsv(pages.map(pageToCsvRow)), "utf8");
await writeFile(path.join(outDir, "images.csv"), toCsv(assetList.filter((asset) => asset.type === "image").map(assetToCsvRow)), "utf8");

console.log("");
console.log(`Done. Pages: ${pages.length}. Assets: ${assetList.length}. Failures: ${failures.length}.`);
console.log(`Output: ${path.resolve(outDir)}`);

function extractPage(url, html, htmlFile) {
  const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = firstMatch(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
  ) || firstMatch(
    html,
    /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i,
  );

  const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => ({
    level: Number(match[1]),
    text: cleanText(match[2]),
  })).filter((item) => item.text);

  const links = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => {
    const href = attr(match[1], "href");
    if (!href) return null;
    const absolute = absolutize(href, url);
    if (!absolute) return null;
    return {
      href: normalizeUrl(absolute),
      text: cleanText(match[2]),
    };
  }).filter(Boolean);

  const images = [...html.matchAll(/<img\b([^>]*)>/gi)].map((match) => {
    const src = attr(match[1], "src") || attr(match[1], "data-src");
    if (!src) return null;
    const absolute = absolutize(src, url);
    if (!absolute) return null;
    return {
      src: normalizeUrl(absolute),
      alt: decodeEntities(attr(match[1], "alt") || ""),
      title: decodeEntities(attr(match[1], "title") || ""),
    };
  }).filter(Boolean);

  const text = cleanText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );

  return {
    url,
    htmlFile,
    title: decodeEntities(title),
    description: decodeEntities(description),
    headings,
    links,
    images,
    text,
    textLength: text.length,
  };
}

function attr(tagAttributes, name) {
  const pattern = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i");
  return firstMatch(tagAttributes, pattern);
}

function firstMatch(value, pattern) {
  const match = value.match(pattern);
  return match ? match[1].trim() : "";
}

function cleanText(value) {
  return decodeEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function absolutize(value, base) {
  const trimmed = value.trim();
  if (!trimmed || /^(mailto|tel|sms|javascript):/i.test(trimmed)) return "";
  try {
    return new URL(trimmed, base).href;
  } catch {
    return "";
  }
}

function normalizeUrl(value) {
  const url = new URL(value);
  url.hash = "";
  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }
  return url.href;
}

function isSameHost(value, siteStart) {
  try {
    const url = new URL(value);
    return url.hostname === siteStart.hostname;
  } catch {
    return false;
  }
}

function isCrawlablePage(value, siteStart) {
  if (!isSameHost(value, siteStart)) return false;
  const url = new URL(value);
  const extension = path.extname(url.pathname).toLowerCase();
  return !extension || [".html", ".htm", ".php", ".asp", ".aspx"].includes(extension);
}

function hash(value) {
  return createHash("sha1").update(value).digest("hex").slice(0, 16);
}

function pageToCsvRow(page) {
  return {
    url: page.url,
    title: page.title,
    description: page.description,
    h1: page.headings.filter((heading) => heading.level === 1).map((heading) => heading.text).join(" | "),
    image_count: page.images.length,
    link_count: page.links.length,
    text_length: page.textLength,
    html_file: page.htmlFile,
  };
}

function assetToCsvRow(asset) {
  return {
    url: asset.url,
    source_page: asset.sourcePage,
    alt: asset.alt || "",
    title: asset.title || "",
    local_file: asset.localFile || "",
    bytes: asset.bytes || "",
    error: asset.downloadError || "",
  };
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvCell(row[header])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function csvCell(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}
