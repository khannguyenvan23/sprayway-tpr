import SiteShell from "@/components/SiteShell";
import AdminNav from "@/components/AdminNav";
import AdminOrdersClient from "@/components/AdminOrdersClient";

export const metadata = {
  title: "Admin đơn hàng | Sprayway TPR Prototype",
};

export default function AdminOrdersPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Admin / Đơn hàng</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">Quản lý đơn hàng</h1>
              <p className="section-copy">Xem, lọc, cập nhật trạng thái và xử lý đơn COD lưu trong Firestore.</p>
            </div>
          </div>
          <AdminNav active="/admin/orders" />
          <AdminOrdersClient />
        </div>
      </section>
    </SiteShell>
  );
}
