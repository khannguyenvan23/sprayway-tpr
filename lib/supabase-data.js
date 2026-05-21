export function normalizeProductRow(row) {
  const brandName = row.brands?.name || row.brand || "";
  const categoryName = row.categories?.name || row.category || "";
  const metadata = row.metadata || {};

  return {
    firestoreId: row.id,
    id: row.id,
    slug: row.slug,
    code: metadata.code || "",
    name: row.name || "",
    originalName: metadata.original_name || row.name || "",
    brand: brandName,
    category: categoryName,
    applications: metadata.applications || [],
    shortDescription: row.short_description || "",
    fullDescription: row.description || "",
    image: row.image_url || "",
    assetPath: row.image_url || "",
    sourceUrl: metadata.source_url || "",
    status: row.status || "active",
    featured: Boolean(row.featured),
    searchText: metadata.search_text || "",
    sku: row.sku || "",
    currency: "VND",
    price: Number(row.price || 0),
    stock: Number(row.stock || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function normalizeCategoryRow(row, count = 0) {
  return {
    firestoreId: row.id,
    id: row.id,
    name: row.name || "",
    slug: row.slug || "",
    description: row.description || "",
    count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function normalizeBrandRow(row, count = 0) {
  return {
    firestoreId: row.id,
    id: row.id,
    name: row.name || "",
    slug: row.slug || "",
    description: row.description || "",
    count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function normalizeOrderRow(orderRow, orderItems = []) {
  const metadata = orderRow.metadata || {};
  return {
    firestoreId: orderRow.id,
    id: orderRow.order_number || orderRow.id,
    createdAt: orderRow.created_at,
    customer: {
      name: orderRow.customer_name || "",
      phone: orderRow.customer_phone || "",
      email: orderRow.customer_email || "",
      address: orderRow.shipping_address || "",
    },
    note: orderRow.note || "",
    paymentMethod: orderRow.payment_method || metadata.paymentMethod || "COD",
    paymentStatus: orderRow.payment_status || metadata.paymentStatus || "",
    shippingMethod: orderRow.shipping_method || metadata.shipping?.method || "",
    shippingFee: Number(orderRow.shipping_fee || 0),
    shipping: {
      method: orderRow.shipping_method || metadata.shipping?.method || "",
      name: orderRow.shipping_name || metadata.shipping?.name || "",
      fee: Number(orderRow.shipping_fee || 0),
      eta: orderRow.shipping_eta || metadata.shipping?.eta || "",
    },
    status: orderRow.status || "pending_confirmation",
    items: orderItems.map((item) => ({
      slug: item.product_sku || item.product_id || item.product_name,
      name: item.product_name,
      sku: item.product_sku || "",
      quantity: Number(item.quantity || 0),
      price: Number(item.price || 0),
      currency: "VND",
    })),
    subtotal: Number(orderRow.subtotal || 0),
    total: Number(orderRow.total || 0),
  };
}

export function slugify(value) {
  const slug = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || `item-${Date.now()}`;
}
