import SiteShell from "@/components/SiteShell";

export const metadata = {
  title: "Mua hàng qua hotline | Sprayway TPR Prototype",
};

export default function CheckoutPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Trang chủ / Mua hàng qua hotline</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">Mua hàng trực tiếp qua hotline</h1>
              <p className="section-copy">
                Website không nhận đơn hàng online. Khách hàng vui lòng gọi hotline để nhận tư vấn, xác nhận giá và thời gian giao hàng.
              </p>
            </div>
          </div>
          <div className="empty cart-empty">
            <h2>Hotline đặt hàng: 0901 890 811</h2>
            <p>Tư vấn sản phẩm Sprayway, TPR, LDH, ANC và vật tư ngành may.</p>
            <div className="hero-actions">
              <a className="button primary" href="tel:0901890811">Gọi hotline ngay</a>
              <a className="button secondary light" href="/products">Quay lại catalog</a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
