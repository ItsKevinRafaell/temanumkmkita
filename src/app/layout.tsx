import type { Metadata } from "next";
import Script from "next/script";
import { Poppins } from "next/font/google";
import { fetchSiteSettings } from "@/lib/api/blog";
import { SITE_URL } from "@/lib/seo/site";
import { buildHomepageProof } from "@/lib/site-proof";
import "./globals.css";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-YPSBSMC0X1";
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
      {
        url: `/brand/android-chrome-192x192.png?${ASSET_VERSION}`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: `/brand/android-chrome-512x512.png?${ASSET_VERSION}`,
        sizes: "512x512",
        type: "image/png",
      },
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
  try {
    settings = await fetchSiteSettings();
  } catch {}

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
        description:
          "Solusi digital untuk UMKM Indonesia — web development, SEO, sosial media, branding.",
        areaServed,
        foundingDate: proof.foundedYear,
        ...(settings?.phone
          ? {
              telephone: settings.phone,
              contactPoint: {
                "@type": "ContactPoint",
                telephone: settings.phone,
                contactType: "customer service",
                areaServed: "ID",
                availableLanguage: "Indonesian",
              },
            }
          : {}),
        ...(settings?.address
          ? {
              address: {
                "@type": "PostalAddress",
                streetAddress: settings.address,
                addressCountry: "ID",
              },
            }
          : {}),
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
        {GSC_VERIFICATION && <meta name="google-site-verification" content={GSC_VERIFICATION} />}
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
      <body className={`${poppins.variable} noise bg-canvas font-sans text-brand-dark antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>

        {/* Floating WhatsApp button */}
        <a
          href="https://wa.me/6289501925395?text=Halo%20Teman%20UMKM%20Kita%2C%20saya%20ingin%20konsultasi%20gratis%20untuk%20bisnis%20saya."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D360] text-white shadow-lg shadow-[#25D360]/30 transition-all duration-200 hover:scale-110 hover:shadow-xl"
          aria-label="Chat WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
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
