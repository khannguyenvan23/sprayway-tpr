"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { saveCodOrder } from "@/lib/firebase-client";
import { formatPrice, isProductPurchasable } from "@/lib/product-utils";
import { useCart } from "./CartProvider";

const ordersKey = "sprayway-orders-v1";

const shippingOptions = [
  { id: "standard", name: "Giao hàng tiêu chuẩn", fee: 35000, eta: "2-4 ngày làm việc" },
  { id: "express", name: "Giao nhanh nội thành", fee: 60000, eta: "Trong ngày hoặc ngày kế tiếp" },
  { id: "pickup", name: "Nhận tại công ty", fee: 0, eta: "Liên hệ trước khi đến nhận" },
];

const paymentOptions = [
  { id: "COD", name: "Thanh toán khi nhận hàng", note: "Nhân viên xác nhận trước khi giao." },
  { id: "BANK_TRANSFER", name: "Chuyển khoản ngân hàng", note: "Thông tin chuyển khoản sẽ được gửi sau khi xác nhận đơn." },
];

export default function CheckoutClient() {
  const { clearCart, items, total } = useCart();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const unavailableItems = items.filter((item) => !isProductPurchasable(item));
  const selectedShipping = shippingOptions.find((option) => option.id === shippingMethod) || shippingOptions[0];
  const selectedPayment = paymentOptions.find((option) => option.id === paymentMethod) || paymentOptions[0];
  const subtotal = Number(total || 0);
  const shippingFee = Number(selectedShipping.fee || 0);
  const grandTotal = subtotal + shippingFee;

  const canSubmit = useMemo(() => {
    return items.length && !unavailableItems.length && form.name.trim() && form.phone.trim() && form.address.trim();
  }, [form.address, form.name, form.phone, items.length, unavailableItems.length]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitOrder(event) {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    const createdOrder = {
      id: createOrderId(),
      channel: "web-checkout",
      createdAt: new Date().toISOString(),
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
      },
      note: form.note.trim(),
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "cod_pending" : "waiting_transfer",
      shippingMethod,
      shippingFee,
      shipping: {
        method: shippingMethod,
        name: selectedShipping.name,
        fee: shippingFee,
        eta: selectedShipping.eta,
      },
      status: "pending_confirmation",
      items,
      subtotal,
      total: grandTotal,
    };

    try {
      await saveCodOrder(createdOrder);
      const stored = JSON.parse(window.localStorage.getItem(ordersKey) || "[]");
      window.localStorage.setItem(ordersKey, JSON.stringify([createdOrder, ...stored]));
      setOrder(createdOrder);
      clearCart();
    } catch (submitError) {
      setError(submitError.message || "Không thể lưu đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (order) {
    return (
      <div className="checkout-success">
        <span>Đặt hàng thành công</span>
        <h2>Mã đơn: {order.id}</h2>
        <p>
          Đơn hàng đã được lưu vào Firestore. Nhân viên sẽ liên hệ xác nhận theo số {order.customer.phone}.
          {order.paymentMethod === "BANK_TRANSFER" ? " Thông tin chuyển khoản sẽ được gửi khi xác nhận đơn." : ""}
        </p>
        <div className="checkout-success-summary">
          <div><span>Vận chuyển</span><strong>{order.shipping.name}</strong></div>
          <div><span>Thanh toán</span><strong>{paymentLabel(order.paymentMethod)}</strong></div>
          <div><span>Tổng đơn</span><strong>{formatPrice(order.total)}</strong></div>
        </div>
        <div className="hero-actions">
          <Link className="button primary" href="/products">Tiếp tục mua hàng</Link>
          <Link className="button secondary light" href="/account">Tài khoản</Link>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="empty cart-empty">
        <h2>Chưa có sản phẩm để checkout</h2>
        <p>Thêm sản phẩm vào giỏ hàng trước khi tạo đơn.</p>
        <Link className="button primary" href="/products">Xem sản phẩm</Link>
      </div>
    );
  }

  return (
    <form className="checkout-layout" onSubmit={submitOrder}>
      <div className="checkout-form">
        <section className="checkout-section">
          <h2>Thông tin nhận hàng</h2>
          <div className="field">
            <label htmlFor="name">Họ tên</label>
            <input id="name" name="name" value={form.name} onChange={updateField} placeholder="Tên người nhận" required />
          </div>
          <div className="field">
            <label htmlFor="phone">Số điện thoại</label>
            <input id="phone" name="phone" value={form.phone} onChange={updateField} placeholder="0901 890 811" required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={updateField} placeholder="email@example.com" />
          </div>
          <div className="field">
            <label htmlFor="address">Địa chỉ giao hàng</label>
            <textarea id="address" name="address" value={form.address} onChange={updateField} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" required />
          </div>
        </section>

        <section className="checkout-section">
          <h2>Vận chuyển</h2>
          <div className="option-list">
            {shippingOptions.map((option) => (
              <label className="checkout-option" key={option.id}>
                <input type="radio" name="shippingMethod" value={option.id} checked={shippingMethod === option.id} onChange={(event) => setShippingMethod(event.target.value)} />
                <span><strong>{option.name}</strong><small>{option.eta}</small></span>
                <b>{formatPrice(option.fee)}</b>
              </label>
            ))}
          </div>
        </section>

        <section className="checkout-section">
          <h2>Thanh toán</h2>
          <div className="option-list">
            {paymentOptions.map((option) => (
              <label className="checkout-option" key={option.id}>
                <input type="radio" name="paymentMethod" value={option.id} checked={paymentMethod === option.id} onChange={(event) => setPaymentMethod(event.target.value)} />
                <span><strong>{option.name}</strong><small>{option.note}</small></span>
              </label>
            ))}
          </div>
        </section>

        <div className="field">
          <label htmlFor="note">Ghi chú</label>
          <textarea id="note" name="note" value={form.note} onChange={updateField} placeholder="Thời gian nhận hàng, yêu cầu xuất hóa đơn..." />
        </div>
      </div>

      <aside className="cart-summary checkout-summary">
        <h2>Đơn hàng</h2>
        {unavailableItems.length ? (
          <p className="checkout-error">
            Có sản phẩm đang hết hàng hoặc tạm ngừng bán. Vui lòng quay lại giỏ hàng để xóa trước khi đặt hàng.
          </p>
        ) : null}
        <div className="checkout-lines">
          {items.map((item) => (
            <div className="checkout-line" key={item.slug}>
              <span>{item.name}</span>
              <strong>{item.quantity} x {formatPrice(item.price, item.currency)}</strong>
            </div>
          ))}
        </div>
        <div className="summary-row">
          <span>Tạm tính</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <div className="summary-row">
          <span>Vận chuyển</span>
          <strong>{formatPrice(shippingFee)}</strong>
        </div>
        <div className="summary-row">
          <span>Thanh toán</span>
          <strong>{selectedPayment.name}</strong>
        </div>
        <div className="summary-row summary-total">
          <span>Tổng tiền</span>
          <strong>{formatPrice(grandTotal)}</strong>
        </div>
        <button className="button primary full-width" type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "Đang lưu đơn..." : "Đặt hàng"}
        </button>
        {error ? <p className="checkout-error">{error}</p> : null}
        <Link className="button ghost full-width" href="/cart">Quay lại giỏ hàng</Link>
      </aside>
    </form>
  );
}

function createOrderId() {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ORD-${ymd}-${suffix}`;
}

function paymentLabel(method) {
  if (method === "BANK_TRANSFER") return "Chuyển khoản ngân hàng";
  return "Thanh toán khi nhận hàng";
}
