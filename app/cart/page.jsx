import SiteShell from "@/components/SiteShell";
import CartClient from "@/components/CartClient";

export const metadata = {
  title: "Giỏ hàng | Sprayway TPR Prototype",
};

export default function CartPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Trang chủ / Giỏ hàng</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">Giỏ hàng</h1>
              <p className="section-copy">Giỏ hàng được lưu local trên trình duyệt để thử nghiệm luồng mua hàng.</p>
            </div>
          </div>
          <CartClient />
        </div>
      </section>
    </SiteShell>
  );
}
