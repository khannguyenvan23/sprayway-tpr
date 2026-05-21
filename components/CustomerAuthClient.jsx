"use client";

import Link from "next/link";
import { useState } from "react";
import { signInCustomer, signUpCustomer } from "@/lib/firebase-client";
import { saveCustomerSession } from "@/lib/customer-session";

export default function CustomerAuthClient() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitAuth(event) {
    event.preventDefault();
    setMessage("");

    if (mode === "register" && form.password !== form.confirmPassword) {
      setMessage("Mật khẩu xác nhận chưa khớp.");
      return;
    }

    setIsLoading(true);
    try {
      const auth = mode === "register"
        ? await signUpCustomer(form.email.trim(), form.password)
        : await signInCustomer(form.email.trim(), form.password);
      saveCustomerSession(auth);
      window.location.href = "/account";
    } catch (error) {
      setMessage(error.message || "Không thể xử lý đăng nhập.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <form className="auth-card" onSubmit={submitAuth}>
        <div className="auth-tabs">
          <button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>
            Đăng nhập
          </button>
          <button className={mode === "register" ? "active" : ""} type="button" onClick={() => setMode("register")}>
            Đăng ký
          </button>
        </div>

        <h1>{mode === "login" ? "Đăng nhập khách hàng" : "Tạo tài khoản khách hàng"}</h1>
        <p>Đăng nhập để lưu thông tin mua hàng và thao tác checkout nhanh hơn.</p>

        <div className="field">
          <label htmlFor="customer-email">Email</label>
          <input
            id="customer-email"
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            placeholder="email@example.com"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="customer-password">Mật khẩu</label>
          <input
            id="customer-password"
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            placeholder="Tối thiểu 6 ký tự"
            required
          />
        </div>
        {mode === "register" ? (
          <div className="field">
            <label htmlFor="customer-confirm">Xác nhận mật khẩu</label>
            <input
              id="customer-confirm"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={updateField}
              required
            />
          </div>
        ) : null}

        <button className="button primary full-width" type="submit" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
        </button>
        {message ? <p className="checkout-error">{message}</p> : null}
      </form>

      <aside className="auth-benefit">
        <span>QE Agency Commerce</span>
        <h2>Tài khoản khách hàng cho luồng ecommerce</h2>
        <p>Sau bước này có thể mở rộng thêm sổ địa chỉ, lịch sử đơn hàng, điểm thành viên và đặt lại đơn nhanh.</p>
        <Link className="button secondary light" href="/products">Tiếp tục xem sản phẩm</Link>
      </aside>
    </div>
  );
}
