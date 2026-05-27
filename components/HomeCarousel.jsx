"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    eyebrow: "Hệ sinh thái công nghệ Mỹ",
    title: "Đánh bay vết dầu máy trong 5 giây - không lo lỗi vải export!",
    copy: "Hệ giải pháp keo xịt định vị và hóa chất tẩy rửa chuyên dụng từ QE Agency. Xử lý triệt để vết bẩn ngay tại dây chuyền, tăng tốc độ đóng gói thành phẩm.",
    bullets: [
      "Hiệu quả tức thì, cam kết không để lại quầng ố",
      "An toàn tuyệt đối cho mọi chất liệu vải cao cấp",
      "Tối ưu chi phí vận hành xưởng lên đến 30%",
    ],
    image: "/carousel/img/banner1.jfif",
    imageAlt: "Chai xịt tẩy dầu Sprayway cho xưởng may",
    href: "/lien-he",
    actionLabel: "Nhận báo giá sỉ tại kho",
    hotline: "0901 890 811",
  },
  {
    eyebrow: "Sạch kinh ngạc - không chỉ là lời quảng cáo!",
    title: 'Crazy Clean 031: "Vua" tẩy rửa đa năng',
    copy: "Đánh bay vết bẩn trong 3 giây. Công nghệ bọt tuyết siêu bám phá vỡ liên kết dầu mỡ, nhựa đường và vết bẩn lâu năm tức thì.",
    bullets: [
      "Xịt và lau - không cần rửa lại: tối ưu cho nội thất xe, máy móc công nghiệp và thiết bị văn phòng.",
      "Không để lại vệt mờ, an toàn cho bề mặt sơn, nhựa, da, kính và kim loại.",
      "Hiệu quả thấy rõ bằng mắt thường chỉ sau một lần xịt.",
    ],
    image: "/carousel/img/banner3-b.jfif",
    imageAlt: "Chai xịt tẩy rửa đa năng Sprayway Crazy Clean 031",
    href: "/lien-he",
    actionLabel: "Liên hệ nhận giá sỉ",
    hotline: "0901 890 811",
  },
  {
    eyebrow: "Best-Seller 2026",
    title: "Tẩy sạch vết bẩn - nâng tầm chất lượng.",
    copy: "Dung dịch tẩy điểm thân thiện với môi trường từ Sprayway Singapore.",
    bullets: [
      "Hiệu quả: Xử lý sạch 98% vết dầu, mực, ố vàng tức thì.",
      "An toàn: Công thức tự phân hủy, không độc hại.",
      "Chuyên nghiệp: Không để lại quầng, không bay màu vải.",
      "Tối ưu: Tương thích hoàn hảo với súng phun công nghiệp.",
    ],
    certificate: "Đạt chuẩn ISO 9001:2008",
    image: "/carousel/img/banner3-c.jfif",
    imageAlt: "Dung dịch tẩy điểm Sprayway Singapore cho xưởng may",
    href: "/lien-he",
    actionLabel: "Liên hệ ngay để nhận mẫu thử miễn phí cho xưởng của bạn!",
    hotline: "0902 335 041",
    featured: true,
  },
];

export default function HomeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 20000);

    return () => window.clearInterval(timer);
  }, []);

  function goToSlide(direction) {
    setActiveIndex((currentIndex) => (currentIndex + direction + slides.length) % slides.length);
  }

  return (
    <section className="hero-carousel" aria-label="Giới thiệu giải pháp QE Agency">
      <div className="container">
        <div className={`hero-carousel-shell${activeSlide.featured ? " featured-cleaning-slide" : ""}`}>
          <div className="hero-carousel-controls" aria-label="Điều hướng carousel">
            <button type="button" onClick={() => goToSlide(-1)} aria-label="Slide trước">
              ‹
            </button>
            <button type="button" onClick={() => goToSlide(1)} aria-label="Slide tiếp theo">
              ›
            </button>
          </div>

          <div className="hero-carousel-grid">
            <div className="hero-carousel-media">
              <span className="hero-product-badge">{activeSlide.eyebrow}</span>
              <div className="hero-carousel-image-frame">
                <img src={activeSlide.image} alt={activeSlide.imageAlt} />
              </div>
            </div>

            <div className="hero-carousel-copy">
              <div className="eyebrow">{activeSlide.eyebrow}</div>
              <h1>{activeSlide.title}</h1>
              <p>{activeSlide.copy}</p>
              <ul className="hero-bullets">
                {activeSlide.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {activeSlide.certificate ? <div className="hero-certificate">{activeSlide.certificate}</div> : null}
              <div className="hero-action-row">
                <Link className="button primary hero-primary-action" href={activeSlide.href}>
                  {activeSlide.actionLabel}
                </Link>
                <a className="button hero-secondary-action" href={`tel:${activeSlide.hotline.replace(/\s/g, "")}`}>
                  Hotline: {activeSlide.hotline}
                </a>
              </div>
            </div>
          </div>

          <div className="carousel-dots" aria-label="Chọn slide">
            {slides.map((slide, index) => (
              <button
                aria-label={`Xem ${slide.eyebrow}`}
                aria-pressed={activeIndex === index}
                className={activeIndex === index ? "active" : ""}
                key={slide.title}
                onClick={() => setActiveIndex(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
