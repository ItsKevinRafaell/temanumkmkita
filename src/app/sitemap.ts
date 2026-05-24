import type { MetadataRoute } from "next";
import { fetchArticles } from "@/lib/api/blog";

export const revalidate = 3600;

const SITE_URL = "https://temanumkmkita.com";

const STATIC_PAGES = [
  { url: SITE_URL, priority: 1.0, changeFrequency: "weekly" },
  { url: `${SITE_URL}/blog`, priority: 0.9, changeFrequency: "daily" },
  { url: `${SITE_URL}/layanan`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/tentang-kami`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${SITE_URL}/kontak`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${SITE_URL}/layanan/website`, priority: 0.75, changeFrequency: "monthly" },
  { url: `${SITE_URL}/layanan/seo`, priority: 0.75, changeFrequency: "monthly" },
  { url: `${SITE_URL}/layanan/sosial-media`, priority: 0.75, changeFrequency: "monthly" },
  { url: `${SITE_URL}/layanan/branding`, priority: 0.75, changeFrequency: "monthly" },
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

  return [...staticEntries, ...articleEntries];
}
