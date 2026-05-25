const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.temanumkmkita.com";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  tags: string;
  status: string;
  featured: boolean;
  read_time: number;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
  seo_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  author_id: string | null;
  author: {
    id: string;
    name: string;
    slug: string;
    role: string | null;
    bio: string | null;
    photo_url: string | null;
    linkedin_url: string | null;
  } | null;
}

export interface PaginatedArticles {
  items: Article[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export async function fetchArticles(params: {
  category?: string;
  page?: number;
  per_page?: number;
}): Promise<PaginatedArticles> {
  const url = new URL(`${API_BASE}/api/articles`);
  if (params.category && params.category !== "Semua") url.searchParams.set("category", params.category);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.per_page) url.searchParams.set("per_page", String(params.per_page));

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}

export async function fetchArticleBySlug(slug: string): Promise<Article> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${API_BASE}/api/articles/${slug}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (res.status === 404) throw new Error("Article not found");
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchAllSlugs(): Promise<string[]> {
  const data = await fetchArticles({ per_page: 100 });
  return data.items.map((a) => a.slug);
}

/* ── Site Settings (public) ───────────────────────────────────────────────── */

export interface SiteSettings {
  id: string;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  twitter_url: string | null;
  address: string | null;
  phone: string | null;
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const res = await fetch(`${API_BASE}/api/settings`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function fetchAllAuthorSlugs(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/authors`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const authors: { slug: string }[] = await res.json();
  return authors.map((a) => a.slug);
}
