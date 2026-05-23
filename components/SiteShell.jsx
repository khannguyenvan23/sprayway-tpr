import SiteHeader from "./SiteHeader";
import FloatingContact from "./FloatingContact";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <strong>CÔNG TY TNHH QE AGENCY</strong>
          <p>Mã Số Thuế: 0318734806</p>
          <p>Hotline: 0901 890 811</p>
          <p>Địa chỉ: Số 10 Sông Thao, Phường Tân Sơn Hòa, Thành Phố Hồ Chí Minh, Việt Nam</p>
          <p>Mail: info@qeagencygroup.com</p>
        </div>
      </div>
    </footer>
  );
}

export default function SiteShell({ children }) {
  return (
    <>
      <SiteHeader />
      {children}
      <FloatingContact />
      <SiteFooter />
    </>
  );
}
