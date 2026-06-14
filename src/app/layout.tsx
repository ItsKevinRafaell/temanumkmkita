import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { fetchSiteSettings } from "@/lib/api/blog";
import { SITE_URL } from "@/lib/seo/site";
import { buildHomepageProof } from "@/lib/site-proof";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
});

const DEFAULT_LOGO_PATH = "/brand/logo-secondary.png";
const DEFAULT_FOOTER_LOGO_PATH = "/brand/logo-footer-yellow.png";
const DEFAULT_FAVICON_PATH = "/brand/favicon.png";
const DEFAULT_LOGO_URL = `${SITE_URL}${DEFAULT_LOGO_PATH}`;

function absoluteAssetUrl(value: string) {
  try {
    return new URL(value, SITE_URL).toString();
  } catch {
    return value;
  }
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Teman UMKM Kita — Solusi Digital untuk UMKM Indonesia",
  description:
    "Kami bantu UMKM kamu hadir dan berkembang secara online. Web development, SEO Google Maps, kelola sosial media, dan lebih banyak lagi.",
  keywords: ["UMKM", "web development", "SEO", "sosial media", "digital marketing", "Indonesia"],
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: DEFAULT_FAVICON_PATH, sizes: "512x512", type: "image/png" },
    ],
    apple: DEFAULT_FAVICON_PATH,
  },
  openGraph: {
    title: "Teman UMKM Kita",
    description: "Solusi Digital untuk UMKM Indonesia",
    url: SITE_URL,
    siteName: "Teman UMKM Kita",
    locale: "id_ID",
    type: "website",
    images: [{ url: DEFAULT_LOGO_URL, width: 1563, height: 1563, alt: "Teman UMKM Kita" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teman UMKM Kita",
    description: "Solusi Digital untuk UMKM Indonesia",
    images: [DEFAULT_LOGO_URL],
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

  const proof = buildHomepageProof(settings);
  const logoCssUrl = settings?.logo_url?.trim() || DEFAULT_LOGO_PATH;
  const logoLightCssUrl = settings?.logo_light_url?.trim() || logoCssUrl;
  const footerLogoCssUrl = DEFAULT_FOOTER_LOGO_PATH;
  const faviconHref = settings?.favicon_url?.trim() || DEFAULT_FAVICON_PATH;
  const logoUrl = settings?.logo_url?.trim()
    ? absoluteAssetUrl(settings.logo_url.trim())
    : DEFAULT_LOGO_URL;
  const areaServed = proof.primaryServiceAreas
    .split(/\s*(?:,|&| dan )\s*/i)
    .map((area) => area.trim())
    .filter(Boolean)
    .map((area) => ({ "@type": "AdministrativeArea", name: area }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#organization`,
        name: "Teman UMKM Kita",
        url: SITE_URL,
        logo: logoUrl,
        description: "Solusi digital untuk UMKM Indonesia — web development, SEO, sosial media, branding.",
        areaServed,
        foundingDate: proof.foundedYear,
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
        <link rel="icon" href={faviconHref} />
        <link rel="apple-touch-icon" href={faviconHref} />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--brand-logo-url:url("${logoCssUrl}");--brand-logo-light-url:url("${logoLightCssUrl}");--brand-logo-footer-url:url("${footerLogoCssUrl}");}`,
          }}
        />
      </head>
      <body className={`${poppins.variable} font-sans antialiased bg-canvas text-brand-dark noise`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
