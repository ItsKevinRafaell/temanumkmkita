import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Teman UMKM Kita — Solusi Digital untuk UMKM Indonesia",
  description:
    "Kami bantu UMKM kamu hadir dan berkembang secara online. Web development, SEO Google Maps, kelola sosial media, dan lebih banyak lagi.",
  keywords: ["UMKM", "web development", "SEO", "sosial media", "digital marketing", "Indonesia"],
  openGraph: {
    title: "Teman UMKM Kita",
    description: "Solusi Digital untuk UMKM Indonesia",
    url: "https://temanumkmkita.com",
    siteName: "Teman UMKM Kita",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} font-sans antialiased bg-canvas text-brand-dark`}>
        {children}
      </body>
    </html>
  );
}
