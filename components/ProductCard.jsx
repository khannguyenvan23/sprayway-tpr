import Link from "next/link";
import { assetSrc, formatPrice, isProductPurchasable, productStatusLabel, productSummary } from "@/lib/product-utils";

export default function ProductCard({ product }) {
  const purchasable = isProductPurchasable(product);

  return (
    <article className={`product-card${purchasable ? "" : " unavailable"}`}>
      <div className="product-badge-row">
        <span className="shop-badge">{product.brand || "Sản phẩm"}</span>
        <span className={purchasable ? "stock-badge available" : "stock-badge"}>
          {purchasable ? "Còn hàng" : productStatusLabel(product.status) || "Hết hàng"}
        </span>
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
          <strong>{formatPrice(product.price, product.currency)}</strong>
          <span>SKU: {product.sku}</span>
          <span>{purchasable ? `Tồn kho: ${product.stock || 0}` : "Tạm ngừng mua"}</span>
        </div>
        <div className="product-card-actions">
          <a className="button primary add-cart-button compact" href="tel:0901890811">
            Đặt hàng qua hotline
          </a>
          <Link className="button ghost compact-detail" href={`/products/${product.slug}`}>Chi tiết</Link>
        </div>
      </div>
    </article>
  );
}
