import type { MetadataRoute } from "next";
import { fetchArticles, fetchAllAuthorSlugs } from "@/lib/api/blog";

export const revalidate = 3600;

const SITE_URL = "https://temanumkmkita.com";

const STATIC_PAGES = [
  { url: SITE_URL, priority: 1.0, changeFrequency: "weekly" },
  { url: `${SITE_URL}/blog`, priority: 0.9, changeFrequency: "daily" },
  { url: `${SITE_URL}/layanan`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/tentang-kami`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${SITE_URL}/kontak`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${SITE_URL}/layanan/web-development`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/layanan/web-development-bulanan`, priority: 0.75, changeFrequency: "monthly" },
  { url: `${SITE_URL}/layanan/seo-google-maps`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/layanan/kelola-sosial-media`, priority: 0.75, changeFrequency: "monthly" },
  { url: `${SITE_URL}/layanan/desain-logo`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${SITE_URL}/layanan/maintenance`, priority: 0.7, changeFrequency: "monthly" },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(({ url, priority, changeFrequency }) => ({
    url,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  let articleEntries: MetadataRoute.Sitemap = [];
  try {
    const data = await fetchArticles({ per_page: 200 });
    articleEntries = data.items.map((a) => ({
      url: `${SITE_URL}/blog/${a.slug}`,
      lastModified: a.updated_at ? new Date(a.updated_at) : new Date(a.created_at),
      changeFrequency: "weekly" as const,
      priority: a.featured ? 0.85 : 0.75,
    }));
  } catch {}

  let authorEntries: MetadataRoute.Sitemap = [];
  try {
    const slugs = await fetchAllAuthorSlugs();
    authorEntries = slugs.map((slug) => ({
      url: `${SITE_URL}/blog/author/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {}

  return [...staticEntries, ...articleEntries, ...authorEntries];
}
