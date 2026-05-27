import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { assetSrc } from "@/lib/product-utils";

function normalizeText(value = "") {
  return repairText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function repairText(value = "") {
  const text = String(value || "");
  const mojibakePattern = /[\u00c2\u00c3\u00c4\u00c6\u00e2][\u0080-\u00ff\u201a\u20ac]?|\u00e1[\u00ba\u00bb]/;
  if (!mojibakePattern.test(text)) return text;

  const decodePart = (part) => {
    try {
      const decoded = new TextDecoder("utf-8").decode(Uint8Array.from(Array.from(part), (char) => char.charCodeAt(0) & 255));
      return decoded.includes("�") ? part : decoded;
    } catch {
      return part;
    }
  };

  const decoded = decodePart(text);
  if (decoded !== text) return decoded;

  return text
    .split(/(\s+)/)
    .map((part) => (mojibakePattern.test(part) ? decodePart(part) : part))
    .join("");
}

function matchesProduct(product, keyword) {
  const haystack = normalizeText(
    [product.name, product.sku, product.code, product.brand, product.category, product.searchText].filter(Boolean).join(" "),
  );
  return haystack.includes(keyword);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = normalizeText(searchParams.get("q") || "");

  if (keyword.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const { products } = await getCatalog();
  const suggestions = products
    .filter((product) => matchesProduct(product, keyword))
    .slice(0, 7)
    .map((product) => ({
      id: product.firestoreId || product.id || product.slug,
      name: repairText(product.name),
      sku: repairText(product.sku),
      brand: repairText(product.brand),
      category: repairText(product.category),
      slug: product.slug,
      href: `/products/${product.slug}`,
      image: assetSrc(product),
    }));

  return NextResponse.json({ suggestions });
}
