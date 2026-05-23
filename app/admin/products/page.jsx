import SiteShell from "@/components/SiteShell";
import AdminNav from "@/components/AdminNav";
import AdminProductsClient from "@/components/AdminProductsClient";

export const metadata = {
  title: "Admin sáº£n pháº©m | QE Agency Trading",
};

export default function AdminProductsPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Admin / Sáº£n pháº©m</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">Quáº£n lÃ½ sáº£n pháº©m</h1>
              <p className="section-copy">Cáº­p nháº­t SKU, giÃ¡, tá»“n kho, tráº¡ng thÃ¡i vÃ  thÃ´ng tin bÃ¡n hÃ ng trong Firestore.</p>
            </div>
          </div>
          <AdminNav active="/admin/products" />
          <AdminProductsClient />
        </div>
      </section>
    </SiteShell>
  );
}

