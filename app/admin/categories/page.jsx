import SiteShell from "@/components/SiteShell";
import AdminNav from "@/components/AdminNav";
import AdminCategoriesClient from "@/components/AdminCategoriesClient";

export const metadata = {
  title: "Admin chuyên mục | Sprayway TPR Prototype",
};

export default function AdminCategoriesPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Admin / Chuyên mục</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">Quản lý chuyên mục</h1>
              <p className="section-copy">Thêm, sửa tên và xóa chuyên mục trong một tab riêng.</p>
            </div>
          </div>
          <AdminNav active="/admin/categories" />
          <AdminCategoriesClient />
        </div>
      </section>
    </SiteShell>
  );
}
