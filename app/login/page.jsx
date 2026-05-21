import CustomerAuthClient from "@/components/CustomerAuthClient";
import SiteShell from "@/components/SiteShell";

export const metadata = {
  title: "Đăng nhập khách hàng | QE Agency",
};

export default function LoginPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Trang chủ / Đăng nhập</p>
          <CustomerAuthClient />
        </div>
      </section>
    </SiteShell>
  );
}
