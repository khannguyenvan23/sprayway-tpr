"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearCustomerSession, readCustomerSession } from "@/lib/customer-session";

export default function CustomerAccountClient() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(readCustomerSession());
  }, []);

  function signOut() {
    clearCustomerSession();
    window.location.href = "/";
  }

  if (!session) {
    return (
      <div className="empty account-empty">
        <h2>Bạn chưa đăng nhập</h2>
        <p>Đăng nhập hoặc tạo tài khoản khách hàng để quản lý thông tin mua hàng.</p>
        <Link className="button primary" href="/login">Đăng nhập khách hàng</Link>
      </div>
    );
  }

  return (
    <div className="account-panel">
      <section className="account-card">
        <span>Tài khoản khách hàng</span>
        <h1>{session.email}</h1>
        <p>Tài khoản đang đăng nhập trên thiết bị này. Các tính năng lịch sử đơn hàng và địa chỉ giao hàng có thể nối tiếp ở bước sau.</p>
        <div className="account-actions">
          <a className="button primary" href="tel:0901890811">Liên hệ báo giá</a>
          <Link className="button secondary light" href="/products">Xem sản phẩm</Link>
          <button className="button ghost" type="button" onClick={signOut}>Đăng xuất</button>
        </div>
      </section>
      <section className="account-card account-next">
        <h2>Có thể nâng cấp tiếp</h2>
        <ul>
          <li>Lưu nhiều địa chỉ giao hàng.</li>
          <li>Lưu lịch sử yêu cầu báo giá theo tài khoản.</li>
          <li>Gửi lại yêu cầu tư vấn cho sản phẩm cũ.</li>
          <li>Nhận báo giá riêng theo nhóm khách hàng.</li>
        </ul>
      </section>
    </div>
  );
}
