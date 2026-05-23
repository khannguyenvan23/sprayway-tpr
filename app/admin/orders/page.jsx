import SiteShell from "@/components/SiteShell";
import AdminNav from "@/components/AdminNav";
import AdminOrdersClient from "@/components/AdminOrdersClient";

export const metadata = {
  title: "Admin Ä‘Æ¡n hÃ ng | QE Agency Trading",
};

export default function AdminOrdersPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Admin / ÄÆ¡n hÃ ng</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">Quáº£n lÃ½ Ä‘Æ¡n hÃ ng</h1>
              <p className="section-copy">Xem, lá»c, cáº­p nháº­t tráº¡ng thÃ¡i vÃ  xá»­ lÃ½ Ä‘Æ¡n COD lÆ°u trong Firestore.</p>
            </div>
          </div>
          <AdminNav active="/admin/orders" />
          <AdminOrdersClient />
        </div>
      </section>
    </SiteShell>
  );
}

