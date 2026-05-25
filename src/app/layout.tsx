import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import AnimatedDots from "@/components/ui/AnimatedDots";
import { fetchSiteSettings } from "@/lib/api/blog";
import { SITE_URL } from "@/lib/seo/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Teman UMKM Kita — Solusi Digital untuk UMKM Indonesia",
  description:
    "Kami bantu UMKM kamu hadir dan berkembang secara online. Web development, SEO Google Maps, kelola sosial media, dan lebih banyak lagi.",
  keywords: ["UMKM", "web development", "SEO", "sosial media", "digital marketing", "Indonesia"],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Teman UMKM Kita",
    description: "Solusi Digital untuk UMKM Indonesia",
    url: SITE_URL,
    siteName: "Teman UMKM Kita",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teman UMKM Kita",
    description: "Solusi Digital untuk UMKM Indonesia",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null;
  try { settings = await fetchSiteSettings(); } catch {}

  const sameAs = [
    settings?.instagram_url,
    settings?.facebook_url,
    settings?.linkedin_url,
    settings?.tiktok_url,
    settings?.youtube_url,
    settings?.twitter_url,
  ].filter(Boolean) as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#organization`,
        name: "Teman UMKM Kita",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description: "Solusi digital untuk UMKM Indonesia — web development, SEO, sosial media, branding.",
        areaServed: "ID",
        ...(settings?.phone ? {
          telephone: settings.phone,
          contactPoint: {
            "@type": "ContactPoint",
            telephone: settings.phone,
            contactType: "customer service",
            areaServed: "ID",
            availableLanguage: "Indonesian",
          },
        } : {}),
        ...(settings?.address ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: settings.address,
            addressCountry: "ID",
          },
        } : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Teman UMKM Kita",
        url: SITE_URL,
        inLanguage: "id-ID",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://api.temanumkmkita.com" />
      </head>
      <body className={`${jakarta.variable} font-sans antialiased bg-canvas text-brand-dark noise`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AnimatedDots />
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
