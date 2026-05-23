import SiteShell from "@/components/SiteShell";

export const metadata = {
  title: "Liên hệ báo giá | Sprayway TPR Prototype",
};

export default function CartPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Trang chủ / Liên hệ báo giá</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">Liên hệ báo giá</h1>
              <p className="section-copy">
                Website đã chuyển sang mô hình catalog. Vui lòng gọi hotline để được tư vấn sản phẩm và nhận báo giá.
              </p>
            </div>
          </div>
          <div className="empty cart-empty">
            <h2>Không sử dụng giỏ hàng online</h2>
            <p>Hotline: 0901 890 811</p>
            <div className="hero-actions">
              <a className="button primary" href="tel:0901890811">Liên hệ báo giá</a>
              <a className="button secondary light" href="/products">Xem sản phẩm</a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
