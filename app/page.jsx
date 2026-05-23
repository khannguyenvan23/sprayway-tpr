import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import ProductCard from "@/components/ProductCard";
import HomeCarousel from "@/components/HomeCarousel";
import HomeIndustrySections from "@/components/HomeIndustrySections";
import { getCatalog, getFeaturedProducts } from "@/lib/catalog";

export const metadata = {
  title: "QE Agency Trading",
  description:
    "QE Agency Trading cung cấp catalog hóa chất công nghiệp, bình xịt Sprayway, keo xịt TPR và vật tư ngành may, in lưới, bảo trì cho doanh nghiệp Việt Nam.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "QE Agency Trading",
    description:
      "Nhà phân phối hóa chất công nghiệp, Sprayway, TPR và vật tư ngành may tại Việt Nam.",
    url: "/",
  },
};

const applications = [
  {
    name: "Mỹ thuật",
    href: `/products?application=${encodeURIComponent("Mỹ Thuật")}`,
    icon: "/assets/037b2e8f96ff96bb.png",
    note: "Keo xịt và hóa chất hỗ trợ sáng tạo",
  },
  {
    name: "Ngoại thất ô tô",
    href: `/products?application=${encodeURIComponent("Ngoại Thất Ô tô")}`,
    icon: "/assets/e523cfe353a5ee44.png",
    note: "Chăm sóc và bảo dưỡng ngoại thất xe",
  },
  {
    name: "Phụ tùng ô tô",
    href: `/products?application=${encodeURIComponent("Phụ Tùng Ô tô")}`,
    icon: "/assets/88da472562e70d5b.png",
    note: "Vệ sinh, bôi trơn và bảo trì phụ tùng",
  },
  {
    name: "Thiết bị ô tô",
    href: `/products?application=${encodeURIComponent("Thiết Bị Ô tô")}`,
    icon: "/assets/b9abdeb44fb18fd9.png",
    note: "Dòng sản phẩm hỗ trợ chăm sóc xe",
  },
  {
    name: "Thiết bị tự động",
    href: `/products?application=${encodeURIComponent("Thiết Bị Tự Động")}`,
    icon: "/assets/9e758d7b496e0a56.png",
    note: "Bảo trì máy móc và thiết bị tự động",
  },
  {
    name: "Điện tử văn phòng",
    href: `/products?application=${encodeURIComponent("Điện Tử & Văn Phòng")}`,
    icon: "/assets/2f022cec872d240e.png",
    note: "Vệ sinh bo mạch và thiết bị văn phòng",
  },
  {
    name: "Gia dụng & nội thất",
    href: `/products?application=${encodeURIComponent("Gia Dụng & Nội Thất")}`,
    icon: "/assets/0812d751f89870ec.png",
    note: "Làm sạch, chăm sóc đồ gia dụng",
  },
  {
    name: "Kiếng và gương",
    href: `/products?application=${encodeURIComponent("Kiếng và Gương")}`,
    icon: "/assets/ec52e4f6fc0786f0.png",
    note: "Lau kính, bảo vệ cạnh gương",
  },
  {
    name: "Nghệ thuật quảng cáo",
    href: `/products?application=${encodeURIComponent("Nghệ Thuật Quảng Cáo")}`,
    icon: "/assets/8b98934db678e8ea.png",
    note: "Vật tư cho quảng cáo và gia công",
  },
  {
    name: "Dịch vụ sửa chữa",
    href: `/products?application=${encodeURIComponent("Dịch Vụ Sửa Chữa")}`,
    icon: "/assets/b384b432c9a591eb.png",
    note: "Hỗ trợ sửa chữa và bảo trì",
  },
  {
    name: "Hàng tiêu dùng",
    href: `/products?application=${encodeURIComponent("Hàng Tiêu Dùng")}`,
    icon: "/assets/b4589d71aba3d047.png",
    note: "Làm sạch, khử mùi, chăm sóc bề mặt",
  },
  {
    name: "Dịch vụ bảo trì",
    href: `/products?application=${encodeURIComponent("Dịch Vụ Bảo Trì")}`,
    icon: "/assets/81b41a613503b779.png",
    note: "Dầu bôi trơn, tẩy dầu mỡ, vệ sinh thiết bị",
  },
  {
    name: "Siêu thị",
    href: `/products?application=${encodeURIComponent("Siêu Thị")}`,
    icon: "/assets/0ee045fc765c8149.png",
    note: "Sản phẩm phù hợp kênh bán lẻ",
  },
  {
    name: "Khung ảnh",
    href: `/products?application=${encodeURIComponent("Khung Ảnh")}`,
    icon: "/assets/e2eab80df9cfdaed.png",
    note: "Keo xịt và vật tư đóng khung",
  },
  {
    name: "In lưới",
    href: `/products?application=${encodeURIComponent("In Lưới")}`,
    icon: "/assets/4bff77d67c5f5d33.png",
    note: "Keo định vị, silicone, hóa chất hỗ trợ in",
  },
  {
    name: "May mặc",
    href: `/products?application=${encodeURIComponent("May Mặc")}`,
    icon: "/assets/8c0fc45c2053b7d9.png",
    note: "Kéo, keo xịt, tẩy dầu, phụ kiện ngành may",
  },
  {
    name: "Quảng cáo",
    href: `/products?application=${encodeURIComponent("Quảng Cáo")}`,
    icon: "/assets/c751a5d73d1e548e.png",
    note: "Vật tư cho bảng hiệu và quảng cáo",
  },
  {
    name: "Ngành gỗ",
    href: `/products?application=${encodeURIComponent("Ngành Gỗ")}`,
    icon: "/assets/359f1fb176ce1162.png",
    note: "Keo xịt, vệ sinh và chăm sóc bề mặt gỗ",
  },
];

export default async function HomePage() {
  const { brands } = await getCatalog();
  const featured = await getFeaturedProducts(8);

  return (
    <SiteShell>
      <HomeCarousel />
      <HomeIndustrySections />

      <section className="consult-process-section">
        <div className="container">
          <div className="consult-process-head">
            <span>Quy trình tư vấn</span>
            <h2>Quy trình hợp tác nhanh gọn trong 3 bước</h2>
            <p>
              QE Agency tiếp nhận nhu cầu trực tuyến và phản hồi giải pháp tối ưu chỉ trong vòng 15-30 phút. Hỗ trợ kỹ thuật và thử mẫu trực tiếp tại nhà xưởng.
            </p>
          </div>
          <div className="consult-process-grid">
            <article>
              <strong>01</strong>
              <h3>Gửi tình trạng lỗi</h3>
              <p>Khách hàng cung cấp thông tin, hình ảnh lỗi bề mặt hoặc nhu cầu qua form, hotline, Zalo hoặc Facebook.</p>
            </article>
            <article>
              <strong>02</strong>
              <h3>Test mẫu miễn phí</h3>
              <p>Chuyên viên QE đối chiếu chất liệu, mang sản phẩm Sprayway/TPR phù hợp đến tận nơi thử nghiệm thực tế.</p>
            </article>
            <article>
              <strong>03</strong>
              <h3>Báo giá sỉ tại kho</h3>
              <p>Nhận phương án chiết khấu tốt nhất theo số lượng, xác nhận tồn kho và hỗ trợ giao hàng siêu tốc toàn quốc.</p>
            </article>
          </div>
          <div className="consult-process-actions">
            <Link className="button primary" href="/lien-he">Gửi nhu cầu tư vấn</Link>
            <a className="button ghost" href="tel:0901890811">Gọi 0901 890 811</a>
          </div>
          <p className="consult-process-note">Tư vấn và kiểm tra mẫu thử tại xưởng hoàn toàn miễn phí.</p>
        </div>
      </section>

      <section id="brands" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Thương hiệu phân phối</h2>
              <p className="section-copy">Chọn thương hiệu để xem đúng nhóm sản phẩm phân phối.</p>
            </div>
          </div>
          <div className="brand-strip">
            {brands.slice(0, 10).map((brand) => (
              <Link className="brand-pill" href={`/products?brand=${encodeURIComponent(brand.name)}`} key={brand.name}>
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section white">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Sản phẩm nổi bật</h2>
              <p className="section-copy">Một số sản phẩm được đánh dấu tạm để đưa lên trang chủ.</p>
            </div>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.firestoreId || product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="applications" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Ứng dụng theo ngành</h2>
              <p className="section-copy">Khách hàng có thể chọn nhu cầu để vào ngay nhóm sản phẩm phù hợp.</p>
            </div>
          </div>
          <div className="application-icon-grid">
            {applications.map((item) => (
              <Link className="application-icon-tile" href={item.href} key={item.name}>
                <img src={item.icon} alt={item.name} loading="lazy" />
                <strong>{item.name}</strong>
                <span>{item.note}</span>
                <em>Xem sản phẩm</em>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}


