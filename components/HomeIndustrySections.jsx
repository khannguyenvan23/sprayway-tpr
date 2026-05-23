const reasons = [
  {
    icon: "US",
    title: "Công nghệ Mỹ",
    copy: "Các sản phẩm QE Agency Trading được phát triển theo tiêu chuẩn cao, chú trọng tính ổn định khi vận hành.",
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
    <section className="home-feature-section why-section">
      <div className="container">
        <div className="home-section-title">
          <h2>Tại sao nên chọn QE Agency Trading?</h2>
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
  );
}
