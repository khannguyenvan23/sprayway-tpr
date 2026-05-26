import Link from "next/link";
import ContactEmailForm from "@/components/ContactEmailForm";
import HomeCarousel from "@/components/HomeCarousel";
import ProductCard from "@/components/ProductCard";
import SiteShell from "@/components/SiteShell";
import { getBestSellerProducts, getCatalog, getFeaturedProducts } from "@/lib/catalog";

export const metadata = {
  title: "QE Agency Trading",
  description:
    "QE Agency Trading cung cấp giải pháp hóa chất công nghiệp, Sprayway, TPR và vật tư ngành may, in lụa, garage, bảo trì nhà xưởng cho khách hàng B2B tại Việt Nam.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "QE Agency Trading",
    description:
      "Corporate website bán hàng B2B cho hóa chất công nghiệp, Sprayway, TPR và vật tư ngành may tại Việt Nam.",
    url: "/",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const solutionCards = [
  {
    title: "Xưởng may & hoàn thiện vải",
    href: `/products?application=${encodeURIComponent("May Mặc")}`,
    note: "Xử lý vết dầu máy, keo thừa, lỗi bề mặt và thao tác hoàn thiện hàng xuất khẩu.",
    items: ["Spot Lifter 830/833", "Tẩy dầu nhanh", "Tư vấn test mẫu tại xưởng"],
  },
  {
    title: "In lưới, in lụa & quảng cáo",
    href: `/products?application=${encodeURIComponent("In Lưới")}`,
    note: "Keo xịt định vị giúp giữ form, giảm lệch hình, hạn chế lem keo và tăng tốc độ in.",
    items: ["Sprayway 82/84", "Keo định vị pallet", "Giá sỉ theo thùng"],
  },
  {
    title: "Garage ô tô & chăm sóc nội thất",
    href: `/products?application=${encodeURIComponent("Ngoại Thất Ô tô")}`,
    note: "Làm sạch, bôi trơn, chống gỉ sét và phục hồi bề mặt cho quy trình chăm sóc xe.",
    items: ["C-60", "Interior Cleaner", "Ship COD toàn quốc"],
  },
  {
    title: "Bảo trì máy móc & nhà xưởng",
    href: `/products?application=${encodeURIComponent("Dịch Vụ Bảo Trì")}`,
    note: "Giảm tiếng kẹt, bảo vệ chi tiết máy và vệ sinh thiết bị trong môi trường sản xuất.",
    items: ["Dầu silicone", "Chống rỉ", "Tư vấn đúng mã"],
  },
];

const trustStats = [
  ["15 phút phản hồi", "Đội ngũ kỹ thuật giải quyết ngay nhu cầu tư vấn kỹ thuật và báo giá B2B."],
  ["100% chính hãng", "Cam kết đúng mã, đúng ứng dụng kỹ thuật. Hoàn tiền nếu không đạt tiêu chuẩn thử nghiệm."],
  ["Giao hàng toàn quốc", "Tối ưu chi phí logistics, hỗ trợ giao hàng nhanh tận xưởng."],
  ["Chính sách kho sỉ", "Chiết khấu thương mại hấp dẫn cho đơn hàng doanh nghiệp và đối tác dài hạn."],
];

export default async function HomePage() {
  const { brands } = await getCatalog();
  const bestSellers = await getBestSellerProducts(8);
  const featuredProducts = await getFeaturedProducts(8);

  return (
    <SiteShell>
      <HomeCarousel />

      <section className="corp-intro-section">
        <div className="container corp-intro-grid">
          <div>
            <span className="corp-eyebrow">Corporate B2B Sales Website</span>
            <h2>QE Agency Trading - Giải pháp hóa chất chuyên dụng cho xưởng sản xuất và garage quy mô lớn.</h2>
            <p>
              Nền tảng tra cứu và cung ứng hóa chất B2B trực tuyến. Tìm đúng mã, nhận tư vấn giải pháp xử lý bề mặt chuyên sâu và nhận báo giá sỉ tối ưu theo số lượng thực tế của doanh nghiệp bạn.
            </p>
          </div>
          <div className="corp-trust-grid">
            {trustStats.map(([value, label]) => (
              <div className="corp-trust-card" key={value}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="applications" className="corp-solutions-section">
        <div className="container">
          <div className="corp-section-head">
            <span>Giải pháp theo ngành</span>
            <h2>Bán theo nhu cầu vận hành, không chỉ bán theo mã sản phẩm</h2>
          </div>
          <div className="corp-solution-grid">
            {solutionCards.map((item) => (
              <Link className="corp-solution-card" href={item.href} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.note}</p>
                <ul>
                  {item.items.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
                <em>Xem nhóm sản phẩm</em>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

      {bestSellers.length ? (
      <section className="section white">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Sản phẩm bán chạy</h2>
            </div>
            <Link className="button ghost" href="/products">Xem tất cả sản phẩm</Link>
          </div>
          <div className="product-grid">
            {bestSellers.map((product) => (
              <ProductCard key={product.firestoreId || product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {featuredProducts.length ? (
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Sản phẩm nổi bật</h2>
            </div>
            <Link className="button ghost" href="/products">Xem tất cả sản phẩm</Link>
          </div>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.firestoreId || product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      ) : null}

      <section id="brands" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Thương hiệu phân phối</h2>
              <p className="section-copy">Chọn thương hiệu để xem đúng nhóm sản phẩm QE Agency đang phân phối và tư vấn.</p>
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

      <section className="corp-quote-section">
        <div className="container corp-quote-grid">
          <div className="corp-quote-copy">
            <span className="corp-eyebrow">Nhận báo giá B2B</span>
            <h2>Gửi nhu cầu, QE Agency phản hồi đúng sản phẩm và phương án giá phù hợp.</h2>
            <p>
              Cho chúng tôi biết ngành nghề, bề mặt cần xử lý, số lượng dự kiến hoặc mã sản phẩm bạn quan tâm. Đội ngũ QE sẽ phản hồi qua email/hotline trong thời gian sớm nhất.
            </p>
            <a className="button ghost" href="tel:0901890811">Gọi trực tiếp 0901 890 811</a>
          </div>
          <div className="corp-quote-form">
            <ContactEmailForm />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
