import SiteShell from "@/components/SiteShell";
import AdminNav from "@/components/AdminNav";
import AdminProductsClient from "@/components/AdminProductsClient";

export const metadata = {
  title: "Admin sản phẩm",
};

export default function AdminProductsPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Admin / Sản phẩm</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">Quản lý sản phẩm</h1>
              <p className="section-copy">Cập nhật SKU, giá, tồn kho, trạng thái và thông tin bán hàng trong Firestore.</p>
            </div>
          </div>
          <AdminNav active="/admin/products" />
          <AdminProductsClient />
        </div>
      </section>
    </SiteShell>
  );
}

