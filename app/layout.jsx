import "./globals.css";

export const metadata = {
  title: "Sprayway TPR Vietnam | Prototype",
  description: "Prototype website sản phẩm công nghiệp Sprayway TPR Vietnam.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
