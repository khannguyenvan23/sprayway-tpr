"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice, isProductPurchasable, productStatusLabel } from "@/lib/product-utils";
import { useCart } from "./CartProvider";

export default function CartClient() {
  const { clearCart, items, removeItem, total, updateQuantity } = useCart();
  const unavailableItems = items.filter((item) => !isProductPurchasable(item));

  if (!items.length) {
    return (
      <div className="empty cart-empty">
        <h2>Giỏ hàng đang trống</h2>
        <p>Chọn sản phẩm phù hợp rồi thêm vào giỏ để tạo đơn hàng.</p>
        <Link className="button primary" href="/products">Xem sản phẩm</Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-items">
        {unavailableItems.length ? (
          <div className="checkout-error cart-warning">
            Có {unavailableItems.length} sản phẩm đang hết hàng hoặc tạm ngừng bán. Vui lòng xóa khỏi giỏ trước khi thanh toán.
          </div>
        ) : null}

        {items.map((item) => {
          const purchasable = isProductPurchasable(item);
          return (
            <article className={`cart-item${purchasable ? "" : " unavailable"}`} key={item.slug}>
              <Link className="cart-item-media" href={`/products/${item.slug}`}>
                <CartItemImage item={item} />
              </Link>
              <div className="cart-item-body">
                <Link href={`/products/${item.slug}`}>
                  <h2>{item.name}</h2>
                </Link>
                <p>SKU: {item.sku}</p>
                <strong>{formatPrice(item.price, item.currency)}</strong>
                {!purchasable ? <p className="stock-alert">{productStatusLabel(item.status)}</p> : null}
              </div>
              <div className="quantity-control">
                <button type="button" disabled={!purchasable} onClick={() => updateQuantity(item.slug, item.quantity - 1)}>-</button>
                <input
                  aria-label={`Số lượng ${item.name}`}
                  value={item.quantity}
                  disabled={!purchasable}
                  onChange={(event) => updateQuantity(item.slug, Number(event.target.value) || 1)}
                />
                <button type="button" disabled={!purchasable} onClick={() => updateQuantity(item.slug, item.quantity + 1)}>+</button>
                <small>{purchasable ? `Tồn: ${item.stock}` : "Không thể mua"}</small>
              </div>
              <button className="remove-item" type="button" onClick={() => removeItem(item.slug)}>
                Xóa
              </button>
            </article>
          );
        })}
      </div>

      <aside className="cart-summary">
        <h2>Tạm tính</h2>
        <div className="summary-row">
          <span>Số dòng sản phẩm</span>
          <strong>{items.length}</strong>
        </div>
        <div className="summary-row">
          <span>Tổng tiền</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        {unavailableItems.length ? (
          <button className="button primary full-width" type="button" disabled>Chưa thể thanh toán</button>
        ) : (
          <Link className="button primary full-width" href="/checkout">Thanh toán</Link>
        )}
        <a className="button secondary light full-width" href="tel:0901890811">Liên hệ đặt hàng</a>
        <button className="button ghost full-width" type="button" onClick={clearCart}>Xóa giỏ hàng</button>
      </aside>
    </div>
  );
}

function CartItemImage({ item }) {
  const [hasError, setHasError] = useState(false);
  const src = item.image ? imageSrc(item.image) : "";

  if (!src || hasError) {
    return <span className="cart-item-image-fallback">Ảnh</span>;
  }

  return <img src={src} alt={item.name} onError={() => setHasError(true)} />;
}

function imageSrc(image) {
  if (image.startsWith("/") || image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  const file = image.split("/").pop();
  return file ? `/assets/${file}` : "";
}
