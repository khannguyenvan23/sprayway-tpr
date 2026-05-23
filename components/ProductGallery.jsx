"use client";

import { useState } from "react";
import { assetSrc } from "@/lib/product-utils";
import { productImageAlt } from "@/lib/product-seo";

export default function ProductGallery({ product }) {
  const [hasError, setHasError] = useState(false);
  const src = assetSrc(product);

  if (!src || hasError) {
    return (
      <div className="product-gallery product-gallery-empty">
        <div className="product-gallery-main product-gallery-fallback">
          <span>Chưa có ảnh</span>
        </div>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <img src={src} alt={productImageAlt(product)} onError={() => setHasError(true)} />
      </div>
    </div>
  );
}
