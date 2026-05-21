"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartLink({ onClick }) {
  const { count } = useCart();

  return (
    <Link className="cart-nav-link" href="/cart" onClick={onClick} aria-label={`Giỏ hàng có ${count} sản phẩm`}>
      <span>Giỏ hàng</span>
      {count ? <strong>{count}</strong> : null}
    </Link>
  );
}
