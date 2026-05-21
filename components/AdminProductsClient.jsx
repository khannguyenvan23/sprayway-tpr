"use client";

import { useEffect, useMemo, useState } from "react";
import { adminEmailDefault, clearAdminSession, readAdminSession, saveAdminSession } from "@/lib/admin-session";
import {
  createAdminCategory,
  createAdminProduct,
  listAdminCategories,
  listAdminProducts,
  signInAdmin,
  updateAdminProduct,
} from "@/lib/firebase-client";
import { assetSrc, formatPrice } from "@/lib/product-utils";

const productStatuses = [
  ["needs_review", "Cần rà soát"],
  ["active", "Đang bán"],
  ["draft", "Bản nháp"],
  ["out_of_stock", "Hết hàng"],
  ["archived", "Ngừng bán"],
];

const emptyDraft = {
  name: "",
  sku: "",
  price: 0,
  stock: 0,
  brand: "",
  category: "",
  status: "active",
  featured: false,
  shortDescription: "",
  fullDescription: "",
  image: "",
};

export default function AdminProductsClient() {
  const [session, setSession] = useState(() => readAdminSession());
  const [email, setEmail] = useState(session?.email || adminEmailDefault);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const categoryOptions = useMemo(() => {
    const fromProducts = products.map((product) => product.category).filter(Boolean);
    const fromCategories = categories.map((category) => category.name).filter(Boolean);
    return [...new Set([...fromCategories, ...fromProducts])].sort((a, b) => a.localeCompare(b, "vi"));
  }, [categories, products]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return products.filter((product) => {
      const haystack = `${product.name} ${product.sku} ${product.brand} ${product.category}`.toLowerCase();
      const matchesQuery = !keyword || haystack.includes(keyword);
      const matchesStatus = !statusFilter || product.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [products, query, statusFilter]);

  const stockSummary = useMemo(() => {
    const lowStock = products.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 10).length;
    const outOfStock = products.filter((product) => Number(product.stock || 0) <= 0).length;
    return { lowStock, outOfStock };
  }, [products]);

  useEffect(() => {
    if (session?.idToken && !products.length) {
      loadCatalogAdmin(session.idToken);
    }
  }, [session]);

  async function handleSignIn(event) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const nextSession = await signInAdmin(email.trim(), password);
      saveAdminSession(nextSession);
      setSession(nextSession);
      setPassword("");
      await loadCatalogAdmin(nextSession.idToken);
    } catch (error) {
      setMessage(error.message || "Không thể đăng nhập admin.");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCatalogAdmin(idToken = session?.idToken) {
    if (!idToken) return;
    setIsLoading(true);
    setMessage("");
    try {
      const [nextProducts, nextCategories] = await Promise.all([
        listAdminProducts(idToken),
        listAdminCategories(idToken),
      ]);
      setProducts(nextProducts);
      setCategories(nextCategories);
      if (nextProducts.length && !isCreating) selectProduct(nextProducts[0]);
    } catch (error) {
      setMessage(error.message || "Không thể tải dữ liệu sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  }

  async function addCategory(event) {
    event.preventDefault();
    const name = newCategory.trim();
    if (!name || !session?.idToken) return;

    setIsSaving(true);
    setMessage("");
    try {
      const created = await createAdminCategory(session.idToken, { name, count: 0 });
      setCategories((current) => [...current.filter((item) => item.name !== name), created]
        .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "vi")));
      setDraft((current) => current ? { ...current, category: name } : current);
      setNewCategory("");
      setMessage("Đã thêm danh mục mới.");
    } catch (error) {
      setMessage(error.message || "Không thể thêm danh mục.");
    } finally {
      setIsSaving(false);
    }
  }

  function startCreateProduct() {
    setSelected(null);
    setDraft({ ...emptyDraft, category: categoryOptions[0] || "" });
    setIsCreating(true);
    setMessage("");
  }

  function selectProduct(product) {
    setSelected(product);
    setIsCreating(false);
    setDraft({
      name: product.name || "",
      sku: product.sku || "",
      price: product.price || 0,
      stock: product.stock || 0,
      brand: product.brand || "",
      category: product.category || "",
      status: product.status || "needs_review",
      featured: Boolean(product.featured),
      shortDescription: product.shortDescription || "",
      fullDescription: product.fullDescription || "",
      image: product.image || product.assetPath || "",
    });
  }

  function updateDraft(event) {
    const { name, type, checked, value } = event.target;
    setDraft((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function saveProduct(event) {
    event.preventDefault();
    if (!draft) return;
    setIsSaving(true);
    setMessage("");
    try {
      const patch = normalizeProductDraft(draft, selected);
      if (isCreating) {
        const created = await createAdminProduct(session.idToken, patch);
        const merged = { ...patch, ...created };
        setProducts((current) => [merged, ...current].sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "vi")));
        setSelected(merged);
        setIsCreating(false);
        setMessage("Đã thêm sản phẩm mới.");
      } else if (selected) {
        const updated = await updateAdminProduct(session.idToken, selected.firestoreId, patch);
        const merged = { ...selected, ...updated, ...patch };
        setProducts((current) => current.map((product) => product.firestoreId === selected.firestoreId ? merged : product));
        setSelected(merged);
        setMessage("Đã lưu sản phẩm.");
      }
    } catch (error) {
      setMessage(error.message || "Không thể lưu sản phẩm.");
    } finally {
      setIsSaving(false);
    }
  }

  function signOut() {
    clearAdminSession();
    setSession(null);
    setProducts([]);
    setCategories([]);
    setSelected(null);
    setDraft(null);
    setIsCreating(false);
  }

  if (!session) {
    return (
      <form className="admin-login" onSubmit={handleSignIn}>
        <h2>Đăng nhập quản lý sản phẩm</h2>
        <div className="field">
          <label htmlFor="admin-product-email">Email admin</label>
          <input id="admin-product-email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="admin-product-password">Mật khẩu</label>
          <input id="admin-product-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button className="button primary" type="submit" disabled={isLoading}>
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập admin"}
        </button>
        {message ? <p className="checkout-error">{message}</p> : null}
      </form>
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-toolbar product-admin-toolbar">
        <div>
          <strong>{session.email}</strong>
          <span>{products.length} sản phẩm - {categoryOptions.length} danh mục - {stockSummary.lowStock} tồn thấp</span>
        </div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên, SKU, brand..." />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {productStatuses.map(([value, label]) => (
            <option value={value} key={value}>{label}</option>
          ))}
        </select>
        <button className="button primary" type="button" onClick={startCreateProduct}>Thêm sản phẩm</button>
        <button className="button ghost" type="button" onClick={() => loadCatalogAdmin()}>
          {isLoading ? "Đang tải..." : "Tải lại"}
        </button>
        <button className="button ghost" type="button" onClick={signOut}>Đăng xuất</button>
      </div>
      {message ? <p className="checkout-error">{message}</p> : null}

      <div className="product-admin-layout">
        <aside className="product-admin-list">
          <form className="category-create-box" onSubmit={addCategory}>
            <label htmlFor="new-category">Tạo danh mục</label>
            <div>
              <input
                id="new-category"
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="Tên danh mục mới"
              />
              <button className="button ghost" type="submit" disabled={isSaving || !newCategory.trim()}>Thêm</button>
            </div>
          </form>

          {filtered.map((product) => (
            <button
              className={`admin-product-row${selected?.firestoreId === product.firestoreId ? " active" : ""}`}
              type="button"
              key={product.firestoreId}
              onClick={() => selectProduct(product)}
            >
              <span className="admin-product-thumb">
                {assetSrc(product) ? <img src={assetSrc(product)} alt={product.name} /> : null}
              </span>
              <span>
                <strong>{product.name}</strong>
                <small>{product.sku} - {formatPrice(product.price, product.currency)} - {product.category}</small>
              </span>
            </button>
          ))}
        </aside>

        {draft ? (
          <form className="product-admin-form" onSubmit={saveProduct}>
            <div className="product-admin-preview">
              {selected && assetSrc(selected) ? <img src={assetSrc(selected)} alt={selected.name} /> : <span className="admin-product-placeholder">Mới</span>}
              <div>
                <span>{isCreating ? "Sản phẩm mới" : selected?.firestoreId}</span>
                <strong>{formatPrice(Number(draft.price), selected?.currency || "VND")}</strong>
              </div>
            </div>
            <div className="field">
              <label htmlFor="product-name">Tên sản phẩm</label>
              <input id="product-name" name="name" value={draft.name} onChange={updateDraft} required />
            </div>
            <div className="product-admin-two">
              <div className="field">
                <label htmlFor="product-sku">SKU</label>
                <input id="product-sku" name="sku" value={draft.sku} onChange={updateDraft} placeholder="Tự tạo nếu để trống" />
              </div>
              <div className="field">
                <label htmlFor="product-status">Trạng thái</label>
                <select id="product-status" name="status" value={draft.status} onChange={updateDraft}>
                  {productStatuses.map(([value, label]) => (
                    <option value={value} key={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="product-admin-two">
              <div className="field">
                <label htmlFor="product-price">Giá bán</label>
                <input id="product-price" name="price" type="number" min="0" step="1000" value={draft.price} onChange={updateDraft} />
              </div>
              <div className="field">
                <label htmlFor="product-stock">Tồn kho</label>
                <input id="product-stock" name="stock" type="number" min="0" value={draft.stock} onChange={updateDraft} />
              </div>
            </div>
            <div className="product-admin-two">
              <div className="field">
                <label htmlFor="product-brand">Thương hiệu</label>
                <input id="product-brand" name="brand" value={draft.brand} onChange={updateDraft} required />
              </div>
              <div className="field">
                <label htmlFor="product-category">Danh mục</label>
                <select id="product-category" name="category" value={draft.category} onChange={updateDraft} required>
                  <option value="">Chọn danh mục</option>
                  {categoryOptions.map((category) => (
                    <option value={category} key={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="product-image">Đường dẫn ảnh</label>
              <input id="product-image" name="image" value={draft.image} onChange={updateDraft} placeholder="/assets/ten-hinh.jpg" />
            </div>
            <div className="field check-field">
              <label>
                <input name="featured" type="checkbox" checked={draft.featured} onChange={updateDraft} />
                Sản phẩm nổi bật
              </label>
            </div>
            <div className="field">
              <label htmlFor="product-short">Mô tả ngắn</label>
              <textarea id="product-short" name="shortDescription" value={draft.shortDescription} onChange={updateDraft} />
            </div>
            <div className="field">
              <label htmlFor="product-full">Mô tả chi tiết</label>
              <textarea id="product-full" name="fullDescription" value={draft.fullDescription} onChange={updateDraft} />
            </div>
            <button className="button primary" type="submit" disabled={isSaving}>
              {isSaving ? "Đang lưu..." : isCreating ? "Tạo sản phẩm" : "Lưu sản phẩm"}
            </button>
          </form>
        ) : (
          <div className="empty">Chọn một sản phẩm để chỉnh sửa hoặc bấm “Thêm sản phẩm”.</div>
        )}
      </div>
    </div>
  );
}

function normalizeProductDraft(draft, selected) {
  const name = draft.name.trim();
  const slug = selected?.slug || slugify(name);
  const id = selected?.id || Date.now();
  const sku = draft.sku.trim() || `QE-${String(id).slice(-6)}`;
  const image = draft.image.trim();

  return {
    id,
    code: selected?.code || String(id).slice(-6),
    name,
    slug,
    sku,
    price: Number(draft.price) || 0,
    stock: Number(draft.stock) || 0,
    brand: draft.brand.trim(),
    category: draft.category.trim(),
    status: draft.status || "active",
    featured: Boolean(draft.featured),
    shortDescription: draft.shortDescription.trim(),
    fullDescription: draft.fullDescription.trim(),
    currency: selected?.currency || "VND",
    image,
    assetPath: image.startsWith("/assets/") ? image : "",
    sourceUrl: selected?.sourceUrl || "",
    applications: selected?.applications || [],
    searchText: `${name} ${sku} ${draft.brand} ${draft.category} ${draft.shortDescription}`.toLowerCase(),
    firestoreId: selected?.firestoreId || slug,
  };
}

function slugify(value) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || `san-pham-${Date.now()}`;
}
