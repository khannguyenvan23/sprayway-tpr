import CustomerAccountClient from "@/components/CustomerAccountClient";
import SiteShell from "@/components/SiteShell";

export const metadata = {
  title: "Tài khoản khách hàng | QE Agency",
};

export default function AccountPage() {
  return (
    <SiteShell>
      <section className="section white">
        <div className="container">
          <p className="breadcrumb">Trang chủ / Tài khoản</p>
          <CustomerAccountClient />
        </div>
      </section>
    </SiteShell>
  );
}
