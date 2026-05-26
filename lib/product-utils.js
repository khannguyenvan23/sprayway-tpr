export function assetSrc(product) {
  const directAsset = product?.assetPath || "";
  if (directAsset) return normalizeAssetSrc(directAsset);

  const image = product?.image || "";
  if (image) return normalizeAssetSrc(image);

  return "";
}

export function normalizeAssetSrc(src) {
  if (!src) return "";
  if (src.startsWith("/")) return src;

  try {
    const url = new URL(src);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return `/api/asset?url=${encodeURIComponent(url.toString())}`;
    }
  } catch {
    const file = src.split("/").pop();
    return file ? `/assets/${file}` : "";
  }

  return src;
}

export function productSummary(product) {
  if (product.shortDescription) return product.shortDescription;
  if (product.category) return `${product.brand} - ${product.category}`;
  return product.brand || "Sản phẩm công nghiệp";
}

export function formatPrice(value, currency = "VND") {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function productStatusLabel(status) {
  const labels = {
    needs_review: "Cần rà soát",
    active: "Đang bán",
    draft: "Bản nháp",
    out_of_stock: "Hết hàng",
    archived: "Ngừng bán",
  };
  return labels[status] || "Đang cập nhật";
}

export function isProductPurchasable(product) {
  if (!product) return false;
  const blockedStatuses = ["out_of_stock", "archived", "draft"];
  return Number(product.stock || 0) > 0 && !blockedStatuses.includes(product.status);
}
