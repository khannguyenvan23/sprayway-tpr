"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isProductPurchasable } from "@/lib/product-utils";
import { useCart } from "./CartProvider";

export default function AddToCartButton({ product, compact = false, checkout = false, label }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const disabled = !isProductPurchasable(product);

  function handleAdd() {
    if (disabled) return;
    addItem(product, 1);
    if (checkout) {
      router.push("/checkout");
      return;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  }

  return (
    <button
      className={`button primary add-cart-button${compact ? " compact" : ""}${checkout ? " buy-now" : ""}`}
      type="button"
      disabled={disabled}
      onClick={handleAdd}
    >
      {disabled ? "Hết hàng" : added ? "Đã thêm" : label || "Thêm vào giỏ"}
    </button>
  );
}
