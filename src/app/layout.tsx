import type { Metadata } from "next";
import Script from "next/script";
import { Poppins } from "next/font/google";
import { fetchSiteSettings } from "@/lib/api/blog";
import { SITE_URL } from "@/lib/seo/site";
import { buildHomepageProof } from "@/lib/site-proof";
import "./globals.css";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
});

const DEFAULT_LOGO_PATH = "/brand/logo-secondary-yellow.png";
const DEFAULT_LOGO_LIGHT_PATH = "/brand/logo-secondary-white.png";
const DEFAULT_FOOTER_LOGO_PATH = "/brand/logo-footer-yellow.png";
const DEFAULT_OG_IMAGE_PATH = "/brand/og-image.png";
const DEFAULT_LOGO_URL = `${SITE_URL}${DEFAULT_LOGO_PATH}`;
// Bump tiap ganti asset brand agar browser re-fetch (cache-busting).
// Tanpa ini, favicon lama tetap ke-cache di URL yang sama.
const ASSET_VERSION = "v3";

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
  alternates: {
    canonical: SITE_URL,
    languages: {
      "id-ID": SITE_URL,
    },
  },
  manifest: `/brand/site.webmanifest?${ASSET_VERSION}`,
  verification: {
    google: GSC_VERIFICATION,
  },
  icons: {
    icon: [
      { url: `/favicon.ico?${ASSET_VERSION}`, sizes: "any" },
      { url: `/brand/favicon.svg?${ASSET_VERSION}`, type: "image/svg+xml" },
      { url: `/brand/favicon-96.png?${ASSET_VERSION}`, sizes: "96x96", type: "image/png" },
      { url: `/brand/favicon-32.png?${ASSET_VERSION}`, sizes: "32x32", type: "image/png" },
      { url: `/brand/favicon-16.png?${ASSET_VERSION}`, sizes: "16x16", type: "image/png" },
      { url: `/brand/android-chrome-192x192.png?${ASSET_VERSION}`, sizes: "192x192", type: "image/png" },
      { url: `/brand/android-chrome-512x512.png?${ASSET_VERSION}`, sizes: "512x512", type: "image/png" },
    ],
    apple: `/brand/apple-touch-icon.png?${ASSET_VERSION}`,
  },
  openGraph: {
    title: "Teman UMKM Kita",
    description: "Solusi Digital untuk UMKM Indonesia",
    url: SITE_URL,
    siteName: "Teman UMKM Kita",
    locale: "id_ID",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE_PATH, width: 1200, height: 630, alt: "Teman UMKM Kita" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teman UMKM Kita",
    description: "Solusi Digital untuk UMKM Indonesia",
    images: [DEFAULT_OG_IMAGE_PATH],
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
  const logoLightCssUrl = settings?.logo_light_url?.trim() || DEFAULT_LOGO_LIGHT_PATH;
  const footerLogoCssUrl = DEFAULT_FOOTER_LOGO_PATH;
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
        {GSC_VERIFICATION && (
          <meta name="google-site-verification" content={GSC_VERIFICATION} />
        )}
        <link rel="alternate" hrefLang="id-ID" href={SITE_URL} />
        {/* CMS favicon override (admin settings). Default icon sudah di-handle metadata.icons.
            Hanya render kalau admin benar-benar set favicon_url, supaya gak duplikat link. */}
        {settings?.favicon_url?.trim() ? (
          <link rel="icon" href={settings.favicon_url.trim()} />
        ) : null}
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
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', {
  page_path: window.location.pathname + window.location.search,
  send_page_view: true,
});`}
          </Script>
        </>
      )}
    </html>
  );
}
