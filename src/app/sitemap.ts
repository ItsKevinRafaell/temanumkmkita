import type { MetadataRoute } from "next";
import { fetchArticles, fetchAllAuthorSlugs } from "@/lib/api/blog";
import { SITE_URL } from "@/lib/seo/site";

export const revalidate = 3600;

const STATIC_PAGES = [
  { url: SITE_URL, priority: 1.0, changeFrequency: "weekly" },
  { url: `${SITE_URL}/blog`, priority: 0.9, changeFrequency: "daily" },
  { url: `${SITE_URL}/layanan`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/tentang-kami`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${SITE_URL}/kontak`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${SITE_URL}/blog/kategori/website`, priority: 0.75, changeFrequency: "weekly" },
  { url: `${SITE_URL}/blog/kategori/seo-google-maps`, priority: 0.75, changeFrequency: "weekly" },
  { url: `${SITE_URL}/blog/kategori/sosial-media`, priority: 0.75, changeFrequency: "weekly" },
  { url: `${SITE_URL}/blog/kategori/branding`, priority: 0.7, changeFrequency: "weekly" },
  { url: `${SITE_URL}/blog/kategori/maintenance`, priority: 0.7, changeFrequency: "weekly" },
  { url: `${SITE_URL}/blog/kategori/tips-bisnis`, priority: 0.7, changeFrequency: "weekly" },
  { url: `${SITE_URL}/blog/topik/website`, priority: 0.75, changeFrequency: "weekly" },
  { url: `${SITE_URL}/blog/topik/seo-google-maps`, priority: 0.75, changeFrequency: "weekly" },
  { url: `${SITE_URL}/blog/topik/sosial-media`, priority: 0.7, changeFrequency: "weekly" },
  { url: `${SITE_URL}/blog/topik/branding`, priority: 0.7, changeFrequency: "weekly" },
  { url: `${SITE_URL}/layanan/web-development`, priority: 0.8, changeFrequency: "monthly" },
  {
    url: `${SITE_URL}/layanan/web-development-bulanan`,
    priority: 0.75,
    changeFrequency: "monthly",
  },
  { url: `${SITE_URL}/layanan/seo-google-maps`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/layanan/kelola-sosial-media`, priority: 0.75, changeFrequency: "monthly" },
  { url: `${SITE_URL}/layanan/desain-logo`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${SITE_URL}/layanan/maintenance`, priority: 0.7, changeFrequency: "monthly" },
] as const;

function articlePriority(publishedAt: string | null, featured: boolean): number {
  if (featured) return 0.9;
  if (!publishedAt) return 0.7;
  const days = (Date.now() - new Date(publishedAt).getTime()) / 86400000;
  if (days < 7) return 0.9;
  if (days < 30) return 0.8;
  return 0.7;
}

async function fetchArticlesWithTimeout(params: {
  per_page: number;
  page: number;
}): Promise<Awaited<ReturnType<typeof fetchArticles>>> {
  const url = buildPublicApiUrl("articles");
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.per_page) url.searchParams.set("per_page", String(params.per_page));

  let lastErr: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const res = await fetch(url.toString(), {
        next: { revalidate: 300 },
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      return res.json();
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastErr!;
}

async function fetchAllPublishedArticles(): Promise<
  Awaited<ReturnType<typeof fetchArticles>>["items"]
> {
  const PAGE_SIZE = 100;
  const first = await fetchArticlesWithTimeout({ per_page: PAGE_SIZE, page: 1 });
  if (first.pages <= 1) return first.items;
  const rest: typeof first.items = [];
  for (let page = 2; page <= first.pages; page++) {
    const next = await fetchArticlesWithTimeout({ per_page: PAGE_SIZE, page });
    rest.push(...next.items);
  }
  return [...first.items, ...rest];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(
    ({ url, priority, changeFrequency }) => ({
      url,
      changeFrequency,
      priority,
    })
  );

  let articleEntries: MetadataRoute.Sitemap = [];
  try {
    const articles = await fetchAllPublishedArticles();
    articleEntries = articles.map((a) => {
      const days = a.published_at
        ? (Date.now() - new Date(a.published_at).getTime()) / 86400000
        : 999;
      return {
        url: `${SITE_URL}/blog/${a.slug}`,
        lastModified: a.updated_at ? new Date(a.updated_at) : new Date(a.created_at),
        changeFrequency: (days < 7 ? "daily" : "weekly") as "daily" | "weekly",
        priority: articlePriority(a.published_at, a.featured),
      };
    });
    console.log(`[sitemap] generated ${articleEntries.length} article entries`);
  } catch (err) {
    console.error("[sitemap] failed to fetch articles:", err instanceof Error ? err.message : err);
  }

  let authorEntries: MetadataRoute.Sitemap = [];
  try {
    const slugs = await fetchAllAuthorSlugs();
    authorEntries = slugs.map((slug) => ({
      url: `${SITE_URL}/blog/author/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
    console.log(`[sitemap] generated ${authorEntries.length} author entries`);
  } catch (err) {
    console.error("[sitemap] failed to fetch authors:", err instanceof Error ? err.message : err);
  }

  const total = staticEntries.length + articleEntries.length + authorEntries.length;
  console.log(`[sitemap] total entries: ${total}`);
  return [...staticEntries, ...articleEntries, ...authorEntries];
}
