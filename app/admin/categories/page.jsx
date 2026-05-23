import SiteShell from "@/components/SiteShell";
import AdminNav from "@/components/AdminNav";
import AdminCategoriesClient from "@/components/AdminCategoriesClient";

export const metadata = {
  title: "Admin chuyÃªn má»¥c | QE Agency Trading",
};

export default function AdminCategoriesPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Admin / ChuyÃªn má»¥c</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">Quáº£n lÃ½ chuyÃªn má»¥c</h1>
              <p className="section-copy">ThÃªm, sá»­a tÃªn vÃ  xÃ³a chuyÃªn má»¥c trong má»™t tab riÃªng.</p>
            </div>
          </div>
          <AdminNav active="/admin/categories" />
          <AdminCategoriesClient />
        </div>
      </section>
    </SiteShell>
  );
}

