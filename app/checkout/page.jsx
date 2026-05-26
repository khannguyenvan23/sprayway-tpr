import SiteShell from "@/components/SiteShell";

export const metadata = {
  title: "Liên hệ báo giá",
};

export default function CheckoutPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Trang chủ / Liên hệ báo giá</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">Liên hệ báo giá</h1>
              <p className="section-copy">
                Website không nhận đơn hàng online. Khách hàng vui lòng gọi hotline để nhận tư vấn sản phẩm và báo giá.
              </p>
            </div>
          </div>
          <div className="empty cart-empty">
            <h2>Hotline tư vấn: 0901 890 811</h2>
            <p>Tư vấn sản phẩm Sprayway, TPR, LDH, ANC và vật tư ngành may.</p>
            <div className="hero-actions">
              <a className="button primary" href="tel:0901890811">Liên hệ báo giá</a>
              <a className="button secondary light" href="/products">Quay lại catalog</a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

