"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { adminEmailDefault, clearAdminSession, readAdminSession, saveAdminSession } from "@/lib/admin-session";
import { listAdminProducts, listOrders, signInAdmin } from "@/lib/firebase-client";
import { formatPrice } from "@/lib/product-utils";

export default function AdminDashboardClient() {
  const [session, setSession] = useState(() => readAdminSession());
  const [email, setEmail] = useState(session?.email || adminEmailDefault);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const stats = useMemo(() => {
    const pendingOrders = orders.filter((order) => order.status === "pending_confirmation");
    const activeProducts = products.filter((product) => product.status === "active");
    const outOfStock = products.filter((product) => Number(product.stock || 0) <= 0);
    const lowStock = products.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 10);
    const revenue = orders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + Number(order.total || 0), 0);

    return {
      activeProducts: activeProducts.length,
      lowStock,
      outOfStock: outOfStock.length,
      pendingOrders,
      products: products.length,
      orders: orders.length,
      revenue,
    };
  }, [orders, products]);

  useEffect(() => {
    if (session?.idToken && !products.length && !orders.length) {
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
      const [nextProducts, nextOrders] = await Promise.all([
        listAdminProducts(idToken),
        listOrders(idToken),
      ]);
      setProducts(nextProducts);
      setOrders(nextOrders);
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
    setOrders([]);
  }

  if (!session) {
    return (
      <div className="admin-dashboard-grid">
        <form className="admin-login admin-login-panel" onSubmit={handleSignIn}>
          <h2>Đăng nhập admin</h2>
          <p>Quản lý sản phẩm, tồn kho và đơn hàng COD từ Firestore.</p>
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
          <h2>Trung tâm điều hành website bán hàng</h2>
          <p>Theo dõi sản phẩm, cập nhật giá/tồn kho, xử lý đơn COD và chuẩn bị mở rộng ecommerce.</p>
        </div>
      </div>
    );
  }

  const recentOrders = orders.slice(0, 5);

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
        <StatCard label="Đơn COD" value={stats.orders} helper={`${stats.pendingOrders.length} chờ xác nhận`} />
        <StatCard label="Tồn kho thấp" value={stats.lowStock.length} helper={`${stats.outOfStock} hết hàng`} />
        <StatCard label="Doanh thu COD" value={formatPrice(stats.revenue)} helper="Không tính đơn đã hủy" />
      </div>

      <div className="admin-workbench">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>Việc cần xử lý</h2>
              <p>Ưu tiên xác nhận đơn và rà soát tồn kho thấp.</p>
            </div>
            <Link className="button primary" href="/admin/orders">Xem đơn hàng</Link>
          </div>
          <div className="admin-task-list">
            {stats.pendingOrders.slice(0, 4).map((order) => (
              <Link className="admin-task-row" href="/admin/orders" key={order.id}>
                <span>
                  <strong>{order.id}</strong>
                  <small>{order.customer?.name} - {order.customer?.phone}</small>
                </span>
                <b>{formatPrice(order.total)}</b>
              </Link>
            ))}
            {!stats.pendingOrders.length ? <div className="empty compact-empty">Không có đơn chờ xác nhận.</div> : null}
          </div>
        </section>

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
      </div>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h2>Đơn gần đây</h2>
            <p>Theo dõi nhanh luồng đặt hàng COD mới nhất.</p>
          </div>
        </div>
        <div className="admin-recent-orders">
          {recentOrders.map((order) => (
            <div className="admin-recent-row" key={order.id}>
              <strong>{order.id}</strong>
              <span>{order.customer?.name || "Khách hàng"}</span>
              <span>{statusLabel(order.status)}</span>
              <b>{formatPrice(order.total)}</b>
            </div>
          ))}
          {!recentOrders.length ? <div className="empty compact-empty">Chưa có đơn hàng.</div> : null}
        </div>
      </section>
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

function statusLabel(status) {
  const labels = {
    pending_confirmation: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    completed: "Hoàn tất",
    cancelled: "Đã hủy",
  };
  return labels[status] || status || "Chưa rõ";
}
