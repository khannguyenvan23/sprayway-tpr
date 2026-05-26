import Link from "next/link";
import FloatingContact from "./FloatingContact";
import SiteHeader from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img className="footer-brand-logo" src="/Banner_web3.png" alt="QE Agency Trading" />
          <p>
            Nhà cung cấp sản phẩm công nghiệp chuyên dụng và giải pháp kỹ thuật số cho xưởng may, in lụa, bảo trì và doanh nghiệp SME.
          </p>
        </div>

        <div className="footer-block">
          <strong>Liên kết nhanh</strong>
          <Link href="/">Trang chủ</Link>
          <Link href="/products">Sản phẩm</Link>
          <Link href="/gioi-thieu">Giới thiệu</Link>
          <a href="https://qeagencygroup.com/" target="_blank" rel="noreferrer">qeagencygroup.com</a>
        </div>

        <div className="footer-block footer-contact">
          <strong>CÔNG TY TNHH QE AGENCY</strong>
          <p>Mã số thuế: 0318734806</p>
          <p><a href="tel:0901890811">Hotline: 0901 890 811</a></p>
          <p><a href="mailto:info@qeagencygroup.com">Email: info@qeagencygroup.com</a></p>
          <p>Số 10 Sông Thao, Phường Tân Sơn Hòa, Thành Phố Hồ Chí Minh, Việt Nam</p>
        </div>

        <div className="footer-bottom">
          <span>© 2026 QE Agency Trading. All rights reserved.</span>
          <span>
            Web Site Make By <a href="https://qeagencygroup.com/" target="_blank" rel="noreferrer">QEAgencygroup.com</a>
          </span>
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
