import { Suspense } from "react";
import SiteShell from "@/components/SiteShell";
import ProductFilters from "@/components/ProductFilters";
import { getCatalog } from "@/lib/catalog";

export const metadata = {
  title: "Sản phẩm | Sprayway TPR Prototype",
};

export default async function ProductsPage() {
  const { products, categories, brands } = await getCatalog();

  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Trang chủ / Sản phẩm</p>
          <div className="section-head shop-head">
            <div>
              <h1 className="section-title">Tất cả sản phẩm</h1>
              <p className="section-copy">
                Chọn nhanh theo thương hiệu, danh mục và nhu cầu sử dụng để tìm đúng sản phẩm cần tư vấn.
              </p>
            </div>
          </div>
          <Suspense fallback={<div className="empty">Đang tải sản phẩm...</div>}>
            <ProductFilters products={products} categories={categories} brands={brands} />
          </Suspense>
        </div>
      </section>
    </SiteShell>
  );
}
