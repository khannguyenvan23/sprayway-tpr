"use client";

import { useEffect, useMemo, useState } from "react";
import { assetSrc } from "@/lib/product-utils";

export default function ProductGallery({ product }) {
  const images = useMemo(() => {
    const gallery = Array.isArray(product?.gallery) ? product.gallery.filter(Boolean) : [];
    const fromGallery = gallery.length ? gallery : [];
    const fromAssets = Array.isArray(product?.images)
      ? product.images
          .map((item) => item?.localFile || item?.url)
          .filter(Boolean)
      : [];
    const main = assetSrc(product);

    return uniqueValues([main, ...fromGallery, ...fromAssets].filter(Boolean));
  }, [product]);

  const [active, setActive] = useState(images[0] || "");

  useEffect(() => {
    setActive(images[0] || "");
  }, [images]);

  if (!images.length) {
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
        <img src={active || images[0]} alt={product.name} />
      </div>
      {images.length > 1 ? (
        <div className="product-gallery-thumbs" aria-label="Ảnh sản phẩm">
          {images.map((src) => (
            <button
              className={`product-gallery-thumb${src === active ? " active" : ""}`}
              key={src}
              type="button"
              onClick={() => setActive(src)}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function uniqueValues(values) {
  return [...new Set(values)];
}
