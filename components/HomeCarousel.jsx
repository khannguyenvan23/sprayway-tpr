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
    eyebrow: "Keo xịt định vị & hóa chất in lưới",
    title: "Giữ chuẩn hình in, hạn chế lem keo và lệch vị trí",
    copy: "Nhóm keo xịt định vị và hóa chất ngành in lưới, in lụa hỗ trợ xưởng in áo thun, in vải giữ vật liệu ổn định trong quá trình thao tác, giảm lỗi bề mặt và tiết kiệm thời gian chỉnh sửa.",
    bullets: [
      "Phù hợp xưởng in áo thun, in vải, in lưới và in lụa",
      "Hạn chế lệch hình in, lem keo và lỗi bề mặt vải",
      "Tư vấn chọn đúng mã theo vật liệu và quy trình in",
    ],
    image: "/carousel/img/banner2.jfif",
    href: "/products?application=In%20Lưới",
  },
  {
    eyebrow: "Gian hàng chính hãng 100% - miễn phí vận chuyển",
    title: "Bảo vệ máy móc toàn diện - sáng bóng như mới trong một nốt nhạc",
    copy: "Dòng sản phẩm bôi trơn, chống gỉ sét và vệ sinh nội thất ô tô chuyên dụng Sprayway. Hiệu quả tức thì, bảo vệ bề mặt bền lâu.",
    bullets: [
      "Bôi trơn, chống rỉ sét và bảo vệ chi tiết máy",
      "Làm sạch, tạo độ sáng bóng cho bề mặt nội thất",
      "Tư vấn đúng mã Sprayway theo nhu cầu bảo trì",
    ],
    image: "/carousel/img/banner3.jfif",
    href: "/products?brand=Sprayway",
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
                <img src={activeSlide.image} alt="Sprayway TPR banner sản phẩm" />
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
