import ContactEmailForm from "@/components/ContactEmailForm";
import SiteShell from "@/components/SiteShell";

export const metadata = {
  title: "Liên hệ | QE Agency Trading",
  description:
    "Liên hệ QE Agency Trading để nhận tư vấn sản phẩm công nghiệp, Sprayway, TPR, vật tư ngành may và giải pháp website doanh nghiệp.",
  alternates: {
    canonical: "/lien-he",
  },
};

export default function ContactPage() {
  return (
    <SiteShell>
      <main className="contact-page">
        <section className="section">
          <div className="container contact-layout">
            <div className="contact-intro">
              <p className="breadcrumb">Trang chủ / Liên hệ</p>
              <h1 className="section-title">Liên hệ QE Agency Trading</h1>
              <p>
                Gửi thông tin nhu cầu của bạn qua email, đội ngũ QE Agency Trading sẽ phản hồi để tư vấn sản phẩm, báo giá hoặc giải pháp phù hợp.
              </p>

              <div className="contact-info-panel">
                <div>
                  <span>Hotline</span>
                  <a href="tel:0901890811">0901 890 811</a>
                </div>
                <div>
                  <span>Email</span>
                  <a href="mailto:info@qeagencygroup.com">info@qeagencygroup.com</a>
                </div>
                <div>
                  <span>Địa chỉ</span>
                  <p>Số 10 Sông Thao, Phường Tân Sơn Hòa, Thành Phố Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>
            </div>

            <div className="contact-form-panel">
              <h2>Form liên hệ qua email</h2>
              <ContactEmailForm />
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
