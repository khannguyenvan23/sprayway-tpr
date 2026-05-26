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
    image: "/assets/01c555b5584a5b4d.jpg",
    imageAlt: "Chai xịt tẩy rửa đa năng Sprayway Crazy Clean 031",
    href: "/lien-he",
    actionLabel: "Liên hệ nhận giá sỉ",
  },
  {
    eyebrow: "Gian hàng chính hãng 100% - Ship COD toàn quốc",
    title: "Máy móc êm ru - xế yêu sáng bóng như mới trong một nốt nhạc!",
    copy: "Đánh bay gỉ sét, triệt tiêu tiếng kêu kẹt khó chịu và phục hồi nội thất tối màu ngay lập tức với bộ giải pháp bảo dưỡng chuyên nghiệp Sprayway C-60, Interior Cleaner. Hiệu quả thấy rõ bằng mắt thường chỉ sau một lần xịt.",
    bullets: [
      "Hiệu quả tức thì: tẩy sạch dầu mỡ bám cặn, nhựa đường và phục hồi da/nhựa bạc màu nhanh chóng",
      "Bảo vệ dài lâu: tạo lớp màng kháng nước, chống oxy hóa bề mặt, ngăn ngừa gỉ sét quay lại",
      "Ưu đãi hấp dẫn: có giá sỉ cho garage và chai nhỏ tiện lợi cho cá nhân tự chăm sóc tại nhà",
    ],
    image: "/carousel/img/banner3-a.jfif",
    imageAlt: "Dung dịch bảo dưỡng máy móc Sprayway cho garage",
    href: "/lien-he",
    actionLabel: "Liên hệ tư vấn",
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
        <div className="hero-carousel-shell">
          <div className="hero-carousel-controls" aria-label="Điều hướng carousel">
            <button type="button" onClick={() => goToSlide(-1)} aria-label="Slide trước">
              ‹
            </button>
            <button type="button" onClick={() => goToSlide(1)} aria-label="Slide tiếp theo">
              ›
            </button>
          </div>

          <div className="hero-carousel-grid">
            <div className="hero-carousel-copy">
              <div className="eyebrow">{activeSlide.eyebrow}</div>
              <h1>{activeSlide.title}</h1>
              <p>{activeSlide.copy}</p>
              <ul className="hero-bullets">
                {activeSlide.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="hero-action-row">
                <Link className="button primary hero-primary-action" href={activeSlide.href}>
                  {activeSlide.actionLabel}
                </Link>
                <a className="button hero-secondary-action" href="tel:0901890811">
                  Gọi hotline 0901 890 811
                </a>
              </div>
            </div>

            <div className="hero-carousel-media">
              <div className="hero-carousel-image-frame">
                <img src={activeSlide.image} alt={activeSlide.imageAlt} />
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
