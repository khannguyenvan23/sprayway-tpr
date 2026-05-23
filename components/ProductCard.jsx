import Link from "next/link";
import { assetSrc, productSummary } from "@/lib/product-utils";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-badge-row">
        <span className="shop-badge">{product.brand || "Sản phẩm"}</span>
      </div>
      <Link className="product-card-link" href={`/products/${product.slug}`}>
        <div className="product-media">
          {assetSrc(product) ? (
            <img src={assetSrc(product)} alt={product.name} loading="lazy" />
          ) : null}
        </div>
      </Link>
      <div className="product-body">
        <Link href={`/products/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="product-summary">{productSummary(product)}</p>
        <div className="product-commerce">
          <span>SKU: {product.sku}</span>
        </div>
        <div className="product-card-actions">
          <Link className="button ghost compact-detail" href={`/products/${product.slug}`}>Chi tiết</Link>
        </div>
      </div>
    </article>
  );
}
