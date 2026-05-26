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
    eyebrow: "Giải pháp định vị chuyên dụng",
    title: "Hình in sắc nét và chuẩn xác - không lo lệch vị trí, không lem keo!",
    copy: "Hệ thống keo xịt định vị cao cấp Sprayway 82/84 sở hữu độ bám dính cực cao và khả năng chịu nhiệt sấy Plastisol vượt trội. Giúp cố định vải hoàn hảo trên pallet, triệt tiêu rủi ro lệch hình mà không để lại cặn keo trên bề mặt.",
    bullets: [
      "Tiết kiệm đến 30% chi phí nhờ giảm tối đa tỷ lệ hàng lỗi, hàng bù",
      "Tăng tốc độ sản xuất với công thức phun sương dàn đều, giữ độ dính qua hàng chục lượt in",
      "Chuẩn xuất khẩu: thành phần an toàn, bảo vệ sức khỏe thợ in",
    ],
    image: "/carousel/img/banner2-2.jfif",
    imageAlt: "Keo xịt định vị Sprayway 82/84 cho in lưới và in lụa",
    href: "/lien-he",
    actionLabel: "Liên hệ nhận giá sỉ xưởng",
  },
  {
    eyebrow: "Gian hàng chính hãng 100% - Ship COD toàn quốc",
    title: "Máy móc êm ru - xế yêu sáng bóng như mới trong một nốt nhạc!",
    copy: "Đánh bay gỉ sét, triệt tiêu tiếng kêu kẹt kẹt khó chịu và phục hồi nội thất tối màu ngay lập tức với bộ giải pháp bảo dưỡng chuyên nghiệp Sprayway C-60, Interior Cleaner. Hiệu quả thấy rõ bằng mắt thường chỉ sau một lần xịt.",
    bullets: [
      "Hiệu quả tức thì: tẩy sạch dầu mỡ bám cặn, nhựa đường và phục hồi da/nhựa bạc màu nhanh chóng",
      "Bảo vệ dài lâu: tạo lớp màng kháng nước, chống oxy hóa bề mặt, ngăn ngừa gỉ sét quay lại",
      "Ưu đãi hấp dẫn: có giá sỉ cho garage và chai nhỏ tiện lợi cho cá nhân tự chăm sóc tại nhà",
    ],
    image: "/carousel/img/banner3.jfif",
    imageAlt: "Dung dịch bảo dưỡng máy móc Sprayway cho garage",
    href: "/lien-he",
    actionLabel: "Sắm ngay tại Shopee Mall",
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
              <div className="hero-action-row">
                <Link className="button primary hero-primary-action" href={activeSlide.href}>{activeSlide.actionLabel}</Link>
                <a className="button hero-secondary-action" href="tel:0901890811">Gọi hotline 0901 890 811</a>
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
