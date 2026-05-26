import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { assetSrc, productSummary } from "@/lib/product-utils";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-badge-row">
        <span className="shop-badge">{product.brand || "Sản phẩm"}</span>
        {product.bestSeller ? <span className="stock-badge available">Bán chạy</span> : null}
      </div>
      <Link className="product-card-link" href={`/products/${product.slug}`}>
        <div className="product-media">
          {assetSrc(product) ? (
            <ProductImage src={assetSrc(product)} alt={product.name} />
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
