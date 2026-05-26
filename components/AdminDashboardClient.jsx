"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { adminEmailDefault, clearAdminSession, readAdminSession, saveAdminSession } from "@/lib/admin-session";
import { listAdminProducts, signInAdmin } from "@/lib/firebase-client";

export default function AdminDashboardClient() {
  const [session, setSession] = useState(() => readAdminSession());
  const [email, setEmail] = useState(session?.email || adminEmailDefault);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const stats = useMemo(() => {
    const activeProducts = products.filter((product) => product.status === "active");
    const outOfStock = products.filter((product) => Number(product.stock || 0) <= 0);
    const lowStock = products.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 10);
    const bestSellers = products.filter((product) => product.bestSeller);

    return {
      activeProducts: activeProducts.length,
      bestSellers: bestSellers.length,
      lowStock,
      outOfStock: outOfStock.length,
      products: products.length,
    };
  }, [products]);

  useEffect(() => {
    if (session?.idToken && !products.length) {
      loadDashboard(session.idToken);
    }
  }, [session]);

  async function handleSignIn(event) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const nextSession = await signInAdmin(email.trim(), password);
      saveAdminSession(nextSession);
      setSession(nextSession);
      setPassword("");
      await loadDashboard(nextSession.idToken);
    } catch (error) {
      setMessage(error.message || "Không thể đăng nhập admin.");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadDashboard(idToken = session?.idToken) {
    if (!idToken) return;
    setIsLoading(true);
    setMessage("");
    try {
      setProducts(await listAdminProducts(idToken));
    } catch (error) {
      setMessage(error.message || "Không thể tải dữ liệu quản trị.");
    } finally {
      setIsLoading(false);
    }
  }

  function signOut() {
    clearAdminSession();
    setSession(null);
    setProducts([]);
  }

  if (!session) {
    return (
      <div className="admin-dashboard-grid">
        <form className="admin-login admin-login-panel" onSubmit={handleSignIn}>
          <h2>Đăng nhập admin</h2>
          <p>Quản lý sản phẩm, chuyên mục, tồn kho và sản phẩm bán chạy.</p>
          <div className="field">
            <label htmlFor="admin-dashboard-email">Email admin</label>
            <input id="admin-dashboard-email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="admin-dashboard-password">Mật khẩu</label>
            <input id="admin-dashboard-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <button className="button primary full-width" type="submit" disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập admin"}
          </button>
          {message ? <p className="checkout-error">{message}</p> : null}
        </form>

        <div className="admin-welcome-panel">
          <span>QE Agency Commerce</span>
          <h2>Trung tâm điều hành catalog bán hàng</h2>
          <p>Theo dõi sản phẩm, cập nhật tồn kho, chọn sản phẩm bán chạy và quản lý chuyên mục hiển thị trên website.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-top">
        <div>
          <span>Đang đăng nhập</span>
          <strong>{session.email}</strong>
        </div>
        <div className="admin-dashboard-actions">
          <button className="button ghost" type="button" onClick={() => loadDashboard()} disabled={isLoading}>
            {isLoading ? "Đang tải..." : "Tải lại dữ liệu"}
          </button>
          <button className="button ghost" type="button" onClick={signOut}>Đăng xuất</button>
        </div>
      </div>

      {message ? <p className="checkout-error">{message}</p> : null}

      <div className="admin-stat-grid">
        <StatCard label="Sản phẩm" value={stats.products} helper={`${stats.activeProducts} đang bán`} />
        <StatCard label="Bán chạy" value={stats.bestSellers} helper="Đang ưu tiên ngoài trang chủ" />
        <StatCard label="Tồn kho thấp" value={stats.lowStock.length} helper={`${stats.outOfStock} hết hàng`} />
      </div>

      <div className="admin-workbench">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>Tồn kho cần chú ý</h2>
              <p>Sản phẩm còn ít hàng hoặc sắp hết.</p>
            </div>
            <Link className="button ghost" href="/admin/products">Cập nhật kho</Link>
          </div>
          <div className="admin-task-list">
            {stats.lowStock.slice(0, 5).map((product) => (
              <Link className="admin-task-row" href="/admin/products" key={product.firestoreId}>
                <span>
                  <strong>{product.name}</strong>
                  <small>{product.sku} - {product.brand}</small>
                </span>
                <b>{product.stock}</b>
              </Link>
            ))}
            {!stats.lowStock.length ? <div className="empty compact-empty">Chưa có sản phẩm tồn kho thấp.</div> : null}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>Sản phẩm bán chạy</h2>
              <p>Tick sản phẩm bán chạy trong trang quản lý sản phẩm để hiển thị ưu tiên.</p>
            </div>
            <Link className="button primary" href="/admin/products">Chọn sản phẩm</Link>
          </div>
          <div className="admin-task-list">
            {products.filter((product) => product.bestSeller).slice(0, 5).map((product) => (
              <Link className="admin-task-row" href="/admin/products" key={product.firestoreId}>
                <span>
                  <strong>{product.name}</strong>
                  <small>{product.sku} - {product.brand}</small>
                </span>
                <b>Bán chạy</b>
              </Link>
            ))}
            {!stats.bestSellers ? <div className="empty compact-empty">Chưa chọn sản phẩm bán chạy.</div> : null}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, helper }) {
  return (
    <article className="admin-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </article>
  );
}
