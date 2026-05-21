import SiteShell from "@/components/SiteShell";
import CheckoutClient from "@/components/CheckoutClient";

export const metadata = {
  title: "Thanh toán | Sprayway TPR Prototype",
};

export default function CheckoutPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Trang chủ / Thanh toán</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">Thanh toán và vận chuyển</h1>
              <p className="section-copy">Khách hàng chọn phương thức giao hàng, thanh toán và gửi đơn để nhân viên xác nhận.</p>
            </div>
          </div>
          <CheckoutClient />
        </div>
      </section>
    </SiteShell>
  );
}
