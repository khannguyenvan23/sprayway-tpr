import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { getCatalog, getProductBySlug } from "@/lib/catalog";
import { productStatusLabel, productSummary } from "@/lib/product-utils";
import {
  breadcrumbJsonLd,
  productCanonicalUrl,
  productJsonLd,
  productSeoContent,
  productSeoDescription,
  productSeoTitle,
} from "@/lib/product-seo";

export async function generateStaticParams() {
  const { products } = await getCatalog();
  const uniqueSlugs = [...new Set(products.map((product) => product.slug))];
  return uniqueSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  if (!product) return {};
  const title = productSeoTitle(product);
  const description = productSeoDescription(product);
  const canonical = productCanonicalUrl(product);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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
  const seoContent = productSeoContent(product);
  const schema = [productJsonLd(product), breadcrumbJsonLd(product)];

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
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
              <Link className="tag" href={`/products?brand=${encodeURIComponent(product.brand)}`}>{product.brand}</Link>
              <Link className="tag" href={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
              <span className="tag">{productStatusLabel(product.status)}</span>
            </div>
            <h1>{product.name}</h1>
            <p className="detail-summary">{productSummary(product)}</p>
            <div className="detail-commerce">
              <span>SKU: {product.sku}</span>
            </div>
            <div className="detail-actions">
              <a className="button primary quote-call-button" href="tel:0901890811" aria-label="Goi hotline 0901890811">
                <span>Liên hệ báo giá</span>
                <strong>Hotline: 0901890811</strong>
              </a>
            </div>
            <div className="spec-list">
              <div className="spec-row"><span>Mã sản phẩm</span><strong>{product.code || "Đang cập nhật"}</strong></div>
              <div className="spec-row"><span>SKU</span><strong>{product.sku}</strong></div>
              <div className="spec-row">
                <span>Thương hiệu</span>
                <Link href={`/products?brand=${encodeURIComponent(product.brand)}`}>{product.brand}</Link>
              </div>
              <div className="spec-row">
                <span>Danh mục</span>
                <Link href={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
              </div>
              <div className="spec-row"><span>Trạng thái</span><strong>{productStatusLabel(product.status)}</strong></div>
            </div>
          </article>
        </div>
      </section>

      <section className="section product-detail-content-section">
        <div className="container">
          <div className="product-description seo-product-content">
            <h2>Thông tin chi tiết về {product.name}</h2>
            {seoContent.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            {seoContent.sections.map((section) => (
              <section className="seo-content-block" key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </section>
            ))}

            <section className="seo-content-block product-faq">
              <h2>Câu hỏi thường gặp về {product.code || product.sku}</h2>
              {seoContent.faqs.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </section>
          </div>
        </div>
      </section>

      <section className="section white">
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
