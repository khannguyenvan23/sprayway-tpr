import { assetSrc, productSummary } from "@/lib/product-utils";

const siteName = "QE Agency";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sprayway-tpr.vercel.app";

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function trimText(value, maxLength) {
  const text = stripHtml(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim().replace(/[,.:-]+$/, "")}…`;
}

export function productCanonicalUrl(product) {
  return `${siteUrl}/products/${product.slug}`;
}

export function productImageAlt(product) {
  const parts = [product.name, product.brand, product.code || product.sku, "chính hãng QE Agency"].filter(Boolean);
  return parts.join(" ");
}

export function productSeoTitle(product) {
  const code = product.code && !String(product.name).toLowerCase().includes(String(product.code).toLowerCase()) ? ` ${product.code}` : "";
  return trimText(`${product.name}${code} | ${siteName}`, 60);
}

export function productSeoDescription(product) {
  const category = product.category ? ` thuộc nhóm ${product.category}` : "";
  const brand = product.brand ? ` thương hiệu ${product.brand}` : "";
  return trimText(`${product.name}${brand}${category}. ${productSummary(product)}. Liên hệ QE Agency để được tư vấn ứng dụng, thông tin kỹ thuật và báo giá nhanh.`, 160);
}

export function productSeoContent(product) {
  const name = product.name;
  const brand = product.brand || "sản phẩm";
  const category = product.category || "vật tư công nghiệp";
  const code = product.code || product.sku;
  const summary = productSummary(product);
  const applications = product.applications?.length ? product.applications.join(", ") : "nhà xưởng, xưởng may, bảo trì và sản xuất";
  const keywords = [
    name,
    `${brand} ${code}`,
    `${category} chính hãng`,
    `chất tẩy vết dầu ngành may`,
    `chai xịt tẩy dầu mỡ trên quần áo`,
  ];

  return {
    intro: [
      `${name} là sản phẩm ${category.toLowerCase()} thuộc thương hiệu ${brand}, phù hợp cho khách hàng cần tìm đúng mã hàng, đúng ứng dụng và nhận tư vấn kỹ thuật trước khi sử dụng. Sản phẩm được QE Agency trình bày theo catalog để người mua dễ tra cứu SKU, thương hiệu, nhóm ngành và lựa chọn sản phẩm liên quan.`,
      `${summary} Với các nhóm sản phẩm dạng bình xịt, keo xịt, hóa chất vệ sinh hoặc vật tư ngành may, người dùng nên kiểm tra bề mặt vật liệu, điều kiện thao tác và mục đích sử dụng trước khi áp dụng trên diện rộng.`,
      `Các từ khóa liên quan thường được khách hàng tìm kiếm gồm: ${keywords.join(", ")}. Nội dung này giúp khách hàng hiểu rõ công dụng, phạm vi ứng dụng và cách liên hệ tư vấn sản phẩm ${code}.`,
    ],
    sections: [
      {
        title: `Công dụng của ${brand} ${code}`,
        body: `${name} được dùng trong nhóm ${category.toLowerCase()}, hỗ trợ các nhu cầu như vệ sinh bề mặt, xử lý vết bẩn, định vị vật liệu, bảo trì thiết bị hoặc chuẩn bị bề mặt tùy theo đặc tính từng sản phẩm. Nhóm khách hàng thường quan tâm gồm ${applications}.`,
      },
      {
        title: `Hướng dẫn sử dụng ${name}`,
        body: `Trước khi sử dụng, nên đọc kỹ nhãn sản phẩm, lắc đều nếu sản phẩm ở dạng bình xịt, thử trước trên một vùng nhỏ và giữ khoảng cách phun phù hợp. Với vải, da, nhựa, kim loại hoặc bề mặt sơn, hãy kiểm tra độ tương thích để tránh ảnh hưởng màu sắc hoặc chất liệu.`,
      },
      {
        title: "Ưu điểm khi mua tại QE Agency",
        body: `QE Agency tập trung phân phối catalog sản phẩm công nghiệp rõ mã, rõ thương hiệu và dễ tra cứu. Khách hàng có thể liên hệ để được tư vấn sản phẩm thay thế, nhóm hàng tương đương, cách dùng phù hợp với ngành may, in lụa, nội thất, ô tô hoặc bảo trì nhà xưởng.`,
      },
      {
        title: "Lưu ý bảo quản",
        body: `Bảo quản sản phẩm ở nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và nguồn nhiệt cao. Không để gần lửa, không chọc thủng bao bì bình xịt, đóng nắp sau khi dùng và để xa tầm tay trẻ em. Khi cần dùng trong môi trường kín, nên đảm bảo thông gió tốt.`,
      },
    ],
    faqs: [
      {
        question: `${name} dùng cho nhóm vật liệu nào?`,
        answer: `Sản phẩm thuộc nhóm ${category.toLowerCase()}. Tùy từng bề mặt như vải, kim loại, nhựa, gỗ hoặc thiết bị công nghiệp, khách hàng nên thử trước trên vùng nhỏ trước khi dùng rộng.`,
      },
      {
        question: `${brand} ${code} có cần tư vấn trước khi dùng không?`,
        answer: "Có. Với sản phẩm hóa chất, bình xịt hoặc vật tư ngành may, tư vấn trước giúp chọn đúng mã, đúng công dụng và hạn chế dùng sai bề mặt.",
      },
      {
        question: `Có thể nhận báo giá ${name} qua hotline không?`,
        answer: "Có. Khách hàng có thể liên hệ QE Agency qua hotline để nhận tư vấn, thông tin sản phẩm và báo giá theo nhu cầu.",
      },
      {
        question: "Sản phẩm có phù hợp cho xưởng may hoặc bảo trì công nghiệp không?",
        answer: `Nhiều sản phẩm trong catalog phù hợp cho ${applications}. Hãy cung cấp mục đích sử dụng để được gợi ý mã hàng phù hợp hơn.`,
      },
    ],
  };
}

export function productJsonLd(product) {
  const image = assetSrc(product);
  const absoluteImage = image ? new URL(image, siteUrl).toString() : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: productSeoDescription(product),
    sku: product.sku,
    mpn: product.code || product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category,
    image: absoluteImage ? [absoluteImage] : undefined,
    url: productCanonicalUrl(product),
  };
}

export function breadcrumbJsonLd(product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Sản phẩm", item: `${siteUrl}/products` },
      { "@type": "ListItem", position: 3, name: product.category, item: `${siteUrl}/products?category=${encodeURIComponent(product.category)}` },
      { "@type": "ListItem", position: 4, name: product.name, item: productCanonicalUrl(product) },
    ],
  };
}
