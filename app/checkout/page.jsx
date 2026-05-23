import SiteShell from "@/components/SiteShell";

export const metadata = {
  title: "LiÃªn há»‡ bÃ¡o giÃ¡ | QE Agency Trading",
};

export default function CheckoutPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Trang chá»§ / LiÃªn há»‡ bÃ¡o giÃ¡</p>
          <div className="section-head">
            <div>
              <h1 className="section-title">LiÃªn há»‡ bÃ¡o giÃ¡</h1>
              <p className="section-copy">
                Website khÃ´ng nháº­n Ä‘Æ¡n hÃ ng online. KhÃ¡ch hÃ ng vui lÃ²ng gá»i hotline Ä‘á»ƒ nháº­n tÆ° váº¥n sáº£n pháº©m vÃ  bÃ¡o giÃ¡.
              </p>
            </div>
          </div>
          <div className="empty cart-empty">
            <h2>Hotline tÆ° váº¥n: 0901 890 811</h2>
            <p>TÆ° váº¥n sáº£n pháº©m Sprayway, TPR, LDH, ANC vÃ  váº­t tÆ° ngÃ nh may.</p>
            <div className="hero-actions">
              <a className="button primary" href="tel:0901890811">LiÃªn há»‡ bÃ¡o giÃ¡</a>
              <a className="button secondary light" href="/products">Quay láº¡i catalog</a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

