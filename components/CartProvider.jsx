"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isProductPurchasable } from "@/lib/product-utils";

const CartContext = createContext(null);
const storageKey = "sprayway-cart-v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo(() => {
    function addItem(product, quantity = 1) {
      if (!isProductPurchasable(product)) return false;

      setItems((current) => {
        const existing = current.find((item) => item.slug === product.slug);
        if (existing) {
          return current.map((item) =>
            item.slug === product.slug
              ? { ...item, status: product.status, stock: product.stock || 0, quantity: Math.min(item.quantity + quantity, product.stock || 999) }
              : item,
          );
        }

        return [
          ...current,
          {
            slug: product.slug,
            name: product.name,
            sku: product.sku,
            price: product.price,
            currency: product.currency || "VND",
            stock: product.stock || 0,
            status: product.status || "needs_review",
            image: product.assetPath || product.image || "",
            quantity: Math.min(quantity, product.stock || 999),
          },
        ];
      });

      return true;
    }

    function updateQuantity(slug, quantity) {
      setItems((current) =>
        current
          .map((item) => item.slug === slug ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock || 999)) } : item)
          .filter((item) => item.quantity > 0),
      );
    }

    function removeItem(slug) {
      setItems((current) => current.filter((item) => item.slug !== slug));
    }

    function clearCart() {
      setItems([]);
    }

    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { addItem, clearCart, count, items, removeItem, total, updateQuantity };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
