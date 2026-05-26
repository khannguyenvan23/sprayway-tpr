import AdminDashboardClient from "@/components/AdminDashboardClient";
import AdminNav from "@/components/AdminNav";
import SiteShell from "@/components/SiteShell";

export const metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Admin / Tổng quan</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">Bảng điều khiển admin</h1>
              <p className="section-copy">Quản lý sản phẩm, tồn kho và đơn hàng COD trong một khu vực riêng.</p>
            </div>
          </div>
          <AdminNav active="/admin" />
          <AdminDashboardClient />
        </div>
      </section>
    </SiteShell>
  );
}

