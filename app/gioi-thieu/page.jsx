export const metadata = {
  title: "Về Chúng Tôi | QE Agency Trading",
  description:
    "QE Agency Trading kết hợp hệ sinh thái sản phẩm công nghiệp chuyên dụng và giải pháp kỹ thuật số toàn diện cho doanh nghiệp tăng trưởng.",
  openGraph: {
    title: "Về Chúng Tôi | QE Agency Trading",
    description:
      "Giải pháp thực chiến cho doanh nghiệp tăng trưởng: sản phẩm công nghiệp chuyên dụng và kỹ thuật số toàn diện.",
    type: "website",
  },
};

const productCards = [
  {
    icon: "TC",
    title: "May mặc & thêu công nghiệp",
    text: "Chai xịt tẩy dầu chuyên dụng Spot Lifter 830/833 xử lý vết bẩn trên vải sáng màu, khô nhanh và hạn chế quầng ố. Phù hợp quy trình kiểm hàng, hoàn thiện và xuất khẩu.",
  },
  {
    icon: "IN",
    title: "In lưới & in lụa",
    text: "Keo xịt định vị vải Sprayway 82/84 có độ bám tốt, chịu nhiệt dưới hệ thống máy sấy, hỗ trợ cố định bề mặt in và giảm lỗi lệch hình trong sản xuất.",
  },
  {
    icon: "KT",
    title: "Ô tô & máy móc cơ khí",
    text: "Bộ giải pháp bôi trơn, chống gỉ sét, tẩy keo C-60 và vệ sinh nội thất đa năng giúp bảo vệ bề mặt, giảm tiếng kẹt và duy trì thiết bị ổn định.",
  },
];

const digitalCards = [
  {
    icon: "WEB",
    title: "Thiết kế & phát triển website cao cấp",
    text: "Xây dựng website doanh nghiệp và landing page trên Next.js, React, Vercel với tốc độ tải nhanh, chuẩn mobile responsive và tối ưu SEO từ nền tảng.",
  },
  {
    icon: "ADS",
    title: "Digital marketing trọn gói",
    text: "Triển khai Google Ads, Facebook Ads và nội dung bán hàng theo đúng nỗi đau khách hàng, hỗ trợ xây phễu chuyển đổi cho mô hình B2B.",
  },
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-container">
          <span className="about-tag">Về chúng tôi</span>
          <h1>
            QE Agency Trading - <em>giải pháp thực chiến</em>
            <br />
            cho doanh nghiệp tăng trưởng
          </h1>
          <p>
            Đơn vị kết hợp hệ sinh thái sản phẩm công nghiệp chuyên dụng và giải pháp kỹ thuật số toàn diện, giúp doanh nghiệp tối ưu vận hành tại xưởng và phát triển trên nền tảng số.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <p className="about-section-label">Hệ sinh thái sản phẩm</p>
          <div className="about-card-grid">
            {productCards.map((card) => (
              <article className="about-card" key={card.title}>
                <span className="about-card-icon">{card.icon}</span>
                <h2>{card.title}</h2>
                <p>{card.text}</p>
              </article>
            ))}
          </div>

          <div className="about-stat-row">
            <div className="about-stat">
              <div className="about-stat-value">5s</div>
              <div className="about-stat-label">Hỗ trợ xử lý nhanh lỗi bề mặt vải</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">30%</div>
              <div className="about-stat-label">Tối ưu chi phí vận hành xưởng in</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">US</div>
              <div className="about-stat-label">Công nghệ Sprayway đạt chuẩn quốc tế</div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <p className="about-section-label">Giải pháp kỹ thuật số</p>
          <div className="about-card-grid about-card-grid-two">
            {digitalCards.map((card) => (
              <article className="about-card" key={card.title}>
                <span className="about-card-icon">{card.icon}</span>
                <h2>{card.title}</h2>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <p className="about-section-label">Giá trị cốt lõi</p>
          <blockquote className="about-quote">
            <p>"Chất lượng thực tế - tăng trưởng số"</p>
          </blockquote>
          <p className="about-value-desc">
            QE Agency Trading không chỉ cung cấp sản phẩm hay bàn giao mã nguồn. Chúng tôi tập trung vào giải pháp có thể áp dụng ngay: giảm tỷ lệ hàng lỗi tại xưởng, nâng cao độ chuyên nghiệp cho doanh nghiệp và xây dựng hình ảnh thương hiệu rõ ràng trên Internet.
          </p>
          <p className="about-pill-label">Đối tác phù hợp</p>
          <div className="about-pills">
            <span>Chủ xưởng may</span>
            <span>Chủ xưởng in</span>
            <span>Quản lý garage</span>
            <span>Doanh nghiệp SME</span>
            <span>Đội ngũ marketing</span>
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="about-container">
          <div className="about-cta-row">
            <a href="tel:0901890811" className="about-btn-primary">Nhận tư vấn miễn phí</a>
            <a href="/products" className="about-btn-ghost">Xem hệ sinh thái sản phẩm</a>
          </div>
        </div>
      </section>
    </main>
  );
}
