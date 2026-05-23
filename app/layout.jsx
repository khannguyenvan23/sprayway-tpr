import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sprayway-tpr.vercel.app"),
  title: {
    default: "QE Agency Trading",
    template: "%s | QE Agency Trading",
  },
  description:
    "QE Agency Trading phân phối hóa chất công nghiệp, bình xịt Sprayway, keo xịt TPR và vật tư ngành may, in lưới, bảo trì nhà xưởng tại Việt Nam.",
  keywords: [
    "QE Agency Trading",
    "Sprayway Việt Nam",
    "TPR Việt Nam",
    "hóa chất công nghiệp",
    "bình xịt công nghiệp",
    "keo xịt định vị",
    "vật tư ngành may",
  ],
  openGraph: {
    title: "QE Agency Trading",
    description:
      "Catalog hóa chất công nghiệp, Sprayway, TPR và vật tư ngành may cho doanh nghiệp tại Việt Nam.",
    siteName: "QE Agency Trading",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
