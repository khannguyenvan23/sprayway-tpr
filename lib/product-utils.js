export function assetSrc(product) {
  if (product?.assetPath) return product.assetPath;

  const file = product?.image?.split("/").pop();
  return file ? `/assets/${file}` : "";
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
