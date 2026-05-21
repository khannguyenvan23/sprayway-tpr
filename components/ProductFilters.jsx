"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";

export default function ProductFilters({ products, categories, brands }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [application, setApplication] = useState(searchParams.get("application") || "");
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const nextProducts = products.filter((product) => {
      const searchText = product.searchText || `${product.name} ${product.sku} ${product.brand} ${product.category}`;
      const matchesQuery = !keyword || searchText.toLowerCase().includes(keyword);
      const matchesCategory = !category || product.category === category;
      const matchesBrand = !brand || product.brand === brand;
      const matchesApplication = !application || product.applications?.includes(application);
      return matchesQuery && matchesCategory && matchesBrand && matchesApplication;
    });

    return nextProducts.sort((left, right) => {
      if (sort === "price-asc") return Number(left.price || 0) - Number(right.price || 0);
      if (sort === "price-desc") return Number(right.price || 0) - Number(left.price || 0);
      if (sort === "stock-desc") return Number(right.stock || 0) - Number(left.stock || 0);
      if (sort === "name-asc") return left.name.localeCompare(right.name, "vi");
      return Number(right.featured || 0) - Number(left.featured || 0);
    });
  }, [products, query, category, brand, application, sort]);

  const hasActiveFilters = query || category || brand || application;
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
          <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Đóng bộ lọc">×</button>
        </div>
        <div className="field">
          <label htmlFor="query">Tìm kiếm</label>
          <input
            id="query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nhập mã, tên, ứng dụng..."
          />
        </div>
        <div className="field">
          <label htmlFor="brand">Thương hiệu</label>
          <select id="brand" value={brand} onChange={(event) => setBrand(event.target.value)}>
            <option value="">Tất cả thương hiệu</option>
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
            <option value="">Tất cả danh mục</option>
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
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="stock-desc">Tồn kho nhiều</option>
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
            <span className="muted">Có giá, SKU, tồn kho và COD</span>
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
