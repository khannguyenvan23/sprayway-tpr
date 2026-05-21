"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteOrder, listOrders, signInAdmin, updateOrderStatus } from "@/lib/firebase-client";
import { adminEmailDefault, clearAdminSession, readAdminSession, saveAdminSession } from "@/lib/admin-session";
import { formatPrice } from "@/lib/product-utils";

const statuses = [
  ["pending_confirmation", "Chờ xác nhận"],
  ["confirmed", "Đã xác nhận"],
  ["shipping", "Đang giao"],
  ["completed", "Hoàn tất"],
  ["cancelled", "Đã hủy"],
];

export default function AdminOrdersClient() {
  const [session, setSession] = useState(() => readAdminSession());
  const [email, setEmail] = useState(session?.email || adminEmailDefault);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredOrders = useMemo(() => {
    if (!statusFilter) return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const totals = useMemo(() => {
    const pending = orders.filter((order) => order.status === "pending_confirmation").length;
    const revenue = orders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + Number(order.total || 0), 0);
    return { pending, revenue };
  }, [orders]);

  useEffect(() => {
    if (session?.idToken && !orders.length) {
      loadOrders(session.idToken);
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
      await loadOrders(nextSession.idToken);
    } catch (error) {
      setMessage(error.message || "Không thể đăng nhập admin.");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadOrders(idToken = session?.idToken) {
    if (!idToken) return;
    setIsLoading(true);
    setMessage("");
    try {
      setOrders(await listOrders(idToken));
    } catch (error) {
      setMessage(error.message || "Không thể tải đơn hàng.");
    } finally {
      setIsLoading(false);
    }
  }

  async function changeStatus(orderId, status) {
    setMessage("");
    try {
      const updated = await updateOrderStatus(session.idToken, orderId, status);
      setOrders((current) => current.map((order) => order.id === orderId ? { ...order, ...updated } : order));
    } catch (error) {
      setMessage(error.message || "Không thể cập nhật đơn hàng.");
    }
  }

  async function removeOrder(orderId) {
    if (!window.confirm(`Xóa đơn ${orderId}?`)) return;
    setMessage("");
    try {
      await deleteOrder(session.idToken, orderId);
      setOrders((current) => current.filter((order) => order.id !== orderId));
    } catch (error) {
      setMessage(error.message || "Không thể xóa đơn hàng.");
    }
  }

  function signOut() {
    clearAdminSession();
    setSession(null);
    setOrders([]);
  }

  if (!session) {
    return (
      <form className="admin-login" onSubmit={handleSignIn}>
        <h2>Đăng nhập quản lý đơn hàng</h2>
        <div className="field">
          <label htmlFor="admin-email">Email admin</label>
          <input id="admin-email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="admin-password">Mật khẩu</label>
          <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button className="button primary" type="submit" disabled={isLoading}>
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập admin"}
        </button>
        {message ? <p className="checkout-error">{message}</p> : null}
      </form>
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-toolbar admin-toolbar-compact">
        <div>
          <strong>{session.email}</strong>
          <span>{orders.length} đơn hàng - {totals.pending} chờ xác nhận - {formatPrice(totals.revenue)}</span>
        </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {statuses.map(([value, label]) => (
            <option value={value} key={value}>{label}</option>
          ))}
        </select>
        <button className="button ghost" type="button" onClick={() => loadOrders()}>
          {isLoading ? "Đang tải..." : "Tải lại"}
        </button>
        <button className="button ghost" type="button" onClick={signOut}>Đăng xuất</button>
      </div>
      {message ? <p className="checkout-error">{message}</p> : null}

      {filteredOrders.length ? (
        <div className="order-table">
          {filteredOrders.map((order) => (
            <article className="order-row" key={order.id}>
              <div>
                <strong>{order.id}</strong>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div>
                <strong>{order.customer?.name || "Khách hàng"}</strong>
                <span>{order.customer?.phone}</span>
                <span>{order.customer?.address}</span>
              </div>
              <div>
                <strong>{formatPrice(order.total)}</strong>
                <span>{order.items?.length || 0} dòng sản phẩm</span>
                <span>Ship: {formatPrice(order.shippingFee || 0)}</span>
              </div>
              <div>
                <strong>{paymentLabel(order.paymentMethod)}</strong>
                <span>{order.shipping?.name || shippingLabel(order.shippingMethod)}</span>
              </div>
              <select value={order.status} onChange={(event) => changeStatus(order.id, event.target.value)}>
                {statuses.map(([value, label]) => (
                  <option value={value} key={value}>{label}</option>
                ))}
              </select>
              <details>
                <summary>Chi tiết</summary>
                <div className="order-lines">
                  {(order.items || []).map((item) => (
                    <div key={item.slug}>
                      <span>{item.name}</span>
                      <strong>{item.quantity} x {formatPrice(item.price, item.currency)}</strong>
                    </div>
                  ))}
                  <p>Tạm tính: {formatPrice(order.subtotal || order.total || 0)}</p>
                  <p>Vận chuyển: {order.shipping?.name || shippingLabel(order.shippingMethod)} - {formatPrice(order.shippingFee || 0)}</p>
                  <p>Thanh toán: {paymentLabel(order.paymentMethod)}</p>
                  {order.note ? <p>Ghi chú: {order.note}</p> : null}
                </div>
              </details>
              <button className="remove-item" type="button" onClick={() => removeOrder(order.id)}>Xóa</button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty">Chưa có đơn hàng phù hợp.</div>
      )}
    </div>
  );
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function paymentLabel(method) {
  if (method === "BANK_TRANSFER") return "Chuyển khoản";
  return "COD";
}

function shippingLabel(method) {
  const labels = {
    standard: "Giao tiêu chuẩn",
    express: "Giao nhanh",
    pickup: "Nhận tại công ty",
  };
  return labels[method] || "Chưa chọn";
}
