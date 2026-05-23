"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const slides = [
  {
    eyebrow: "Nhà phân phối hóa chất và vật tư công nghiệp",
    title: "Bình xịt công nghiệp cho xưởng may, bảo trì và sản xuất",
    copy: "Tập trung các dòng Sprayway, TPR, LDH và ANC cho vệ sinh, bôi trơn, chống rỉ, keo xịt và xử lý bề mặt trong môi trường công nghiệp.",
    image: "/assets/8206026da8c442cd.png",
    primaryHref: "/products?brand=Sprayway",
    primaryLabel: "Xem dòng Sprayway",
    secondaryHref: "/products",
    secondaryLabel: "Toàn bộ sản phẩm",
    metrics: ["Bình xịt", "Keo xịt", "Bảo trì"],
  },
  {
    eyebrow: "Giải pháp cho ngành may mặc",
    title: "Vật tư ngành may cho chuyền sản xuất cần thao tác nhanh",
    copy: "Keo định vị, phấn may, tẩy vết bẩn, kéo và vật tư phụ trợ giúp xưởng giảm thời gian tìm hàng và đặt đúng nhóm sản phẩm.",
    image: "/assets/8c0fc45c2053b7d9.png",
    primaryHref: `/products?application=${encodeURIComponent("May Mặc")}`,
    primaryLabel: "Sản phẩm ngành may",
    secondaryHref: "tel:0901890811",
    secondaryLabel: "Tư vấn nhanh",
    metrics: ["May mặc", "Tẩy vết", "Định vị"],
  },
  {
    eyebrow: "Keo xịt và hóa chất TPR",
    title: "Catalog hóa chất rõ nhóm, dễ lọc theo thương hiệu và ứng dụng",
    copy: "Tìm sản phẩm theo SKU, thương hiệu, tồn kho và nhóm sử dụng để đặt hàng COD hoặc liên hệ báo giá nhanh cho doanh nghiệp.",
    image: "/assets/4bff77d67c5f5d33.png",
    primaryHref: "/products?brand=TPR",
    primaryLabel: "Xem TPR",
    secondaryHref: "/checkout",
    secondaryLabel: "Tạo đơn hàng",
    metrics: ["COD", "SKU", "Báo giá"],
  },
];

export default function HomeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const productPreview = useMemo(() => {
    return activeSlide.metrics.join(" / ");
  }, [activeSlide]);

  return (
    <section className="hero-carousel" aria-label="Giới thiệu QE Agency">
      <div className="container hero-carousel-grid">
        <div className="hero-carousel-copy">
          <div className="eyebrow">{activeSlide.eyebrow}</div>
          <h1>{activeSlide.title}</h1>
          <p>{activeSlide.copy}</p>
          <div className="hero-actions">
            <Link className="button primary" href={activeSlide.primaryHref}>{activeSlide.primaryLabel}</Link>
            <Link className="button secondary" href={activeSlide.secondaryHref}>{activeSlide.secondaryLabel}</Link>
          </div>
          <div className="carousel-tabs" role="tablist" aria-label="Chọn nội dung giới thiệu">
            {slides.map((slide, index) => (
              <button
                aria-selected={activeIndex === index}
                className={activeIndex === index ? "active" : ""}
                key={slide.title}
                onClick={() => setActiveIndex(index)}
                role="tab"
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {slide.metrics[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-carousel-media">
          <img src={activeSlide.image} alt="" />
          <div className="hero-carousel-badge">
            <span>Nhóm chính</span>
            <strong>{productPreview}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
