"use client";

import { useState } from "react";

export default function ProductImage({ alt, className = "", src }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <span className={`product-image-fallback ${className}`.trim()}>Ảnh</span>;
  }

  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setHasError(true)} />;
}
