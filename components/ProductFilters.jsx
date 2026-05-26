"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import SearchSuggestInput from "./SearchSuggestInput";

function normalizeText(value = "") {
  return repairText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
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

export default function ProductFilters({ products, categories, brands }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [application, setApplication] = useState(searchParams.get("application") || "");
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const keyword = normalizeText(query.trim());
    const nextProducts = products.filter((product) => {
      const searchText = product.searchText || `${product.name} ${product.sku} ${product.brand} ${product.category}`;
      const matchesQuery = !keyword || normalizeText(searchText).includes(keyword);
      const matchesCategory = !category || product.category === category;
      const matchesBrand = !brand || product.brand === brand;
      const matchesApplication = !application || product.applications?.includes(application);
      return matchesQuery && matchesCategory && matchesBrand && matchesApplication;
    });

    return nextProducts.sort((left, right) => {
      if (sort === "name-asc") return left.name.localeCompare(right.name, "vi");
      return Number(right.featured || 0) - Number(left.featured || 0);
    });
  }, [products, query, category, brand, application, sort]);

  const hasActiveFilters = query || category || brand || application;
  const totalBrandCount = brands.reduce((sum, item) => sum + Number(item.count || 0), 0) || products.length;
  const totalCategoryCount = categories.reduce((sum, item) => sum + Number(item.count || 0), 0) || products.length;
  const resetFilters = () => {
    setQuery("");
    setCategory("");
    setBrand("");
    setApplication("");
    setSort("featured");
  };

  return (
    <div className="catalog-shell">
      <button className="button ghost filter-toggle" type="button" onClick={() => setFiltersOpen((value) => !value)}>
        {filtersOpen ? "Đóng bộ lọc" : "Mở bộ lọc"}
      </button>

      <aside className={`filter-panel${filtersOpen ? " open" : ""}`}>
        <div className="filter-title-row">
          <h2>Lọc sản phẩm</h2>
          <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Đóng bộ lọc">
            ×
          </button>
        </div>
        <div className="field">
          <label htmlFor="query">Tìm kiếm</label>
          <SearchSuggestInput
            ariaLabel="Tìm kiếm sản phẩm"
            id="query"
            value={query}
            onChange={setQuery}
            onSelect={(suggestion) => setQuery(suggestion.name)}
            products={products}
            placeholder="Nhập mã, tên, ứng dụng..."
          />
        </div>
        <div className="field">
          <label htmlFor="brand">Thương hiệu</label>
          <select id="brand" value={brand} onChange={(event) => setBrand(event.target.value)}>
            <option value="">Tất cả thương hiệu ({totalBrandCount})</option>
            {brands.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name} ({item.count})
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="category">Danh mục</label>
          <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Tất cả danh mục ({totalCategoryCount})</option>
            {categories.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name} ({item.count})
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort">Sắp xếp</label>
          <select id="sort" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Nổi bật</option>
            <option value="name-asc">Tên A-Z</option>
          </select>
        </div>
        {hasActiveFilters ? (
          <div className="active-filters">
            {query ? <span>Từ khóa: {query}</span> : null}
            {brand ? <span>Thương hiệu: {brand}</span> : null}
            {category ? <span>Danh mục: {category}</span> : null}
            {application ? <span>Ứng dụng: {application}</span> : null}
          </div>
        ) : null}
        <button className="button primary full-width" type="button" onClick={resetFilters}>
          Xóa bộ lọc
        </button>
      </aside>

      <main>
        <div className="catalog-toolbar">
          <div>
            <strong>{filtered.length}</strong> <span className="muted">sản phẩm phù hợp</span>
          </div>
          <div className="catalog-toolbar-actions">
            <span className="muted">Có SKU, thương hiệu và thông tin tư vấn</span>
          </div>
        </div>
        {filtered.length ? (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.firestoreId || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty">Không tìm thấy sản phẩm phù hợp.</div>
        )}
      </main>
    </div>
  );
}
