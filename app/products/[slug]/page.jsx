import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { getCatalog, getProductBySlug } from "@/lib/catalog";
import { formatPrice, isProductPurchasable, productStatusLabel, productSummary } from "@/lib/product-utils";

export async function generateStaticParams() {
  const { products } = await getCatalog();
  const uniqueSlugs = [...new Set(products.map((product) => product.slug))];
  return uniqueSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  if (!product) return {};
  return {
    title: `${product.name} | Sprayway TPR Prototype`,
    description: productSummary(product),
  };
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  if (!product) notFound();

  const { products } = await getCatalog();
  const related = products
    .filter((item) => item.id !== product.id && (item.category === product.category || item.brand === product.brand))
    .slice(0, 4);
  const purchasable = isProductPurchasable(product);

  return (
    <SiteShell>
      <section className="section white">
        <div className="container detail-grid">
          <div className="detail-media">
            <ProductGallery product={product} />
          </div>
          <article className="detail">
            <p className="breadcrumb">
              <Link href="/">Trang chủ</Link> / <Link href="/products">Sản phẩm</Link> / {product.brand}
            </p>
            <div className="meta-row">
              <span className="tag">{product.brand}</span>
              <span className="tag">{product.category}</span>
              <span className="tag">{productStatusLabel(product.status)}</span>
            </div>
            <h1>{product.name}</h1>
            <p className="detail-summary">{productSummary(product)}</p>
            <div className="detail-commerce">
              <strong>{formatPrice(product.price, product.currency)}</strong>
              <span>SKU: {product.sku}</span>
              <span>{purchasable ? `Còn hàng: ${product.stock}` : "Tạm ngừng mua"}</span>
            </div>
            <div className="detail-actions">
              <a className="button primary" href="tel:0901890811">Đặt hàng qua hotline</a>
              <a className="button secondary light" href="tel:0901890811">Mua hàng trực tiếp qua hotline</a>
              <a className="button ghost" href="tel:0901890811">Liên hệ báo giá</a>
            </div>
            <div className="spec-list">
              <div className="spec-row"><span>Mã sản phẩm</span><strong>{product.code || "Đang cập nhật"}</strong></div>
              <div className="spec-row"><span>SKU</span><strong>{product.sku}</strong></div>
              <div className="spec-row"><span>Giá bán</span><strong>{formatPrice(product.price, product.currency)}</strong></div>
              <div className="spec-row"><span>Tồn kho</span><strong>{product.stock}</strong></div>
              <div className="spec-row"><span>Thương hiệu</span><strong>{product.brand}</strong></div>
              <div className="spec-row"><span>Danh mục</span><strong>{product.category}</strong></div>
              <div className="spec-row"><span>Nguồn dữ liệu</span><a href={product.sourceUrl} target="_blank">Website cũ</a></div>
              <div className="spec-row"><span>Trạng thái</span><strong>{productStatusLabel(product.status)}</strong></div>
            </div>
          </article>
        </div>
      </section>

      {product.fullDescription ? (
        <section className="section">
          <div className="container">
            <div className="product-description">
              <h2>Mô tả sản phẩm</h2>
              {product.fullDescription.split("\n").map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={product.fullDescription ? "section white" : "section"}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Sản phẩm liên quan</h2>
              <p className="section-copy">Cùng thương hiệu hoặc danh mục.</p>
            </div>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard product={item} key={item.firestoreId || item.id} />
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
