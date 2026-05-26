import Link from "next/link";

const items = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/categories", label: "Chuyên mục" },
  { href: "/", label: "Xem website" },
];

export default function AdminNav({ active = "" }) {
  return (
    <nav className="admin-nav" aria-label="Admin">
      {items.map((item) => (
        <Link className={active === item.href ? "active" : ""} href={item.href} key={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
