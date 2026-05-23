import { Suspense } from "react";
import SiteShell from "@/components/SiteShell";
import ProductFilters from "@/components/ProductFilters";
import { getCatalog } from "@/lib/catalog";

export const metadata = {
  title: "Sáº£n pháº©m | QE Agency Trading",
};

export default async function ProductsPage() {
  const { products, categories, brands } = await getCatalog();

  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Trang chá»§ / Sáº£n pháº©m</p>
          <div className="section-head shop-head">
            <div>
              <h1 className="section-title">Táº¥t cáº£ sáº£n pháº©m</h1>
              <p className="section-copy">
                Chá»n nhanh theo thÆ°Æ¡ng hiá»‡u, danh má»¥c vÃ  nhu cáº§u sá»­ dá»¥ng Ä‘á»ƒ tÃ¬m Ä‘Ãºng sáº£n pháº©m cáº§n tÆ° váº¥n.
              </p>
            </div>
          </div>
          <Suspense fallback={<div className="empty">Äang táº£i sáº£n pháº©m...</div>}>
            <ProductFilters products={products} categories={categories} brands={brands} />
          </Suspense>
        </div>
      </section>
    </SiteShell>
  );
}

