import Link from "next/link";

const categories = [
  {
    title: "Dòng tẩy rửa",
    copy: "Loại bỏ vết dầu máy, bụi bẩn và các vết ô cứng đầu ngay tại dây chuyền.",
    image: "/assets/0031a095007bb025.png",
    href: "/products?category=Bình xịt công nghiệp Sprayway",
  },
  {
    title: "Dòng định vị",
    copy: "Keo xịt định vị vải, keo thêu không mùi, giữ nếp form hoàn hảo.",
    image: "/assets/12923f274ee76bfa.png",
    href: "/products?brand=TPR",
  },
  {
    title: "Dòng bảo trì",
    copy: "Bôi trơn kim, bảo vệ máy móc khỏi rỉ sét và tăng tuổi thọ thiết bị.",
    image: "/assets/efa83ed845ca4f99.png",
    href: "/products?application=Dịch%20Vụ%20Bảo%20Trì",
  },
];

const reasons = [
  {
    icon: "US",
    title: "Công nghệ Mỹ",
    copy: "Các dòng Sprayway được phát triển theo tiêu chuẩn cao, chú trọng tính ổn định khi vận hành.",
  },
  {
    icon: "OK",
    title: "An toàn & thân thiện",
    copy: "Tư vấn đúng mã sản phẩm để hạn chế ảnh hưởng đến bề mặt vật liệu và môi trường thao tác.",
  },
  {
    icon: "24",
    title: "Hiệu suất vượt trội",
    copy: "Rút ngắn thời gian xử lý hàng lỗi, hỗ trợ tối ưu quy trình vận hành nhà xưởng.",
  },
];

export default function HomeIndustrySections() {
  return (
    <>
      <section className="home-feature-section">
        <div className="container">
          <div className="home-section-title">
            <h2>Danh mục sản phẩm chủ lực</h2>
          </div>
          <div className="home-category-grid">
            {categories.map((item) => (
              <Link className="home-category-card" href={item.href} key={item.title}>
                <div className="home-category-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-feature-section why-section">
        <div className="container">
          <div className="home-section-title">
            <h2>Tại sao nên chọn Sprayway-TPR?</h2>
          </div>
          <div className="home-reason-grid">
            {reasons.map((item) => (
              <article className="home-reason-card" key={item.title}>
                <div className="home-reason-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
