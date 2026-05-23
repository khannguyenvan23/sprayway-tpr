import SiteShell from "@/components/SiteShell";

export const metadata = {
  title: "LiÃªn há»‡ bÃ¡o giÃ¡ | QE Agency Trading",
};

export default function CartPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Trang chá»§ / LiÃªn há»‡ bÃ¡o giÃ¡</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">LiÃªn há»‡ bÃ¡o giÃ¡</h1>
              <p className="section-copy">
                Website Ä‘Ã£ chuyá»ƒn sang mÃ´ hÃ¬nh catalog. Vui lÃ²ng gá»i hotline Ä‘á»ƒ Ä‘Æ°á»£c tÆ° váº¥n sáº£n pháº©m vÃ  nháº­n bÃ¡o giÃ¡.
              </p>
            </div>
          </div>
          <div className="empty cart-empty">
            <h2>KhÃ´ng sá»­ dá»¥ng giá» hÃ ng online</h2>
            <p>Hotline: 0901 890 811</p>
            <div className="hero-actions">
              <a className="button primary" href="tel:0901890811">LiÃªn há»‡ bÃ¡o giÃ¡</a>
              <a className="button secondary light" href="/products">Xem sáº£n pháº©m</a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

