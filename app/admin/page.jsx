import AdminDashboardClient from "@/components/AdminDashboardClient";
import AdminNav from "@/components/AdminNav";
import SiteShell from "@/components/SiteShell";

export const metadata = {
  title: "Admin | QE Agency Trading",
};

export default function AdminPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Admin / Tá»•ng quan</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">Báº£ng Ä‘iá»u khiá»ƒn admin</h1>
              <p className="section-copy">Quáº£n lÃ½ sáº£n pháº©m, tá»“n kho vÃ  Ä‘Æ¡n hÃ ng COD trong má»™t khu vá»±c riÃªng.</p>
            </div>
          </div>
          <AdminNav active="/admin" />
          <AdminDashboardClient />
        </div>
      </section>
    </SiteShell>
  );
}

