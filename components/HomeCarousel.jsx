"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    eyebrow: "Giải pháp tổng thể",
    title: "Chuyên gia làm sạch & bảo trì ngành may",
    copy: "Từ khâu định vị vải, thêu công nghiệp đến xử lý lỗi thành phẩm và bảo trì máy móc. QE Agency cung cấp nhóm hóa chất giúp quy trình sản xuất sạch, nhanh và ổn định.",
    bullets: [
      "An toàn cho nhiều bề mặt vải và thiết bị",
      "Hiệu quả tức thì, hạn chế để lại dấu vết",
      "Catalog rõ mã, dễ lọc theo thương hiệu",
    ],
    image: "/carousel/img/banner1.jfif",
    href: "/products?brand=Sprayway",
  },
  {
    eyebrow: "Dòng tẩy rửa",
    title: "Xử lý vết dầu, bụi bẩn và lỗi bề mặt nhanh",
    copy: "Các dòng chai xịt tẩy rửa hỗ trợ xưởng may, in lụa, nội thất và bảo trì công nghiệp trong những tình huống cần thao tác nhanh, sạch và dễ kiểm soát.",
    bullets: [
      "Phù hợp quy trình kiểm hàng và hoàn thiện",
      "Dễ tra cứu theo SKU, thương hiệu, danh mục",
      "Tư vấn chọn đúng mã theo bề mặt sử dụng",
    ],
    image: "/carousel/img/banner1.jfif",
    href: "/products?category=Bình xịt công nghiệp Sprayway",
  },
  {
    eyebrow: "Keo xịt & định vị",
    title: "Giữ form, định vị vật liệu và tối ưu chuyền sản xuất",
    copy: "Nhóm keo xịt, hóa chất TPR và vật tư ngành may giúp giảm thời gian căn chỉnh, hỗ trợ thao tác dán tạm, cố định chi tiết và xử lý sản phẩm trước khi hoàn thiện.",
    bullets: [
      "Hỗ trợ ngành may, thêu, in lụa và quảng cáo",
      "Nhiều mã sản phẩm cho từng nhu cầu thao tác",
      "Liên hệ nhanh để được gợi ý sản phẩm phù hợp",
    ],
    image: "/carousel/img/banner1.jfif",
    href: "/products?brand=TPR",
  },
];

export default function HomeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 6500);

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
            <button type="button" onClick={() => goToSlide(-1)} aria-label="Slide trước">‹</button>
            <button type="button" onClick={() => goToSlide(1)} aria-label="Slide tiếp theo">›</button>
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
              <Link className="button primary hero-primary-action" href={activeSlide.href}>Khám phá danh mục</Link>
            </div>

            <div className="hero-carousel-media">
              <div className="hero-carousel-image-frame">
                <img src={activeSlide.image} alt="Sprayway TPR banner sản phẩm ngành may" />
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
