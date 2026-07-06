const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.temanumkmkita.com";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("admin_token") ?? "";
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type ApiErrorItem = {
  detail?: unknown;
  message?: unknown;
  msg?: unknown;
  loc?: unknown;
};

function cleanApiErrorText(value: string): string {
  return value.replace(/^Value error,\s*/i, "").trim();
}

function errorMessageFromDetail(detail: unknown, fallback: string): string {
  if (!detail) return fallback;
  if (typeof detail === "string") return cleanApiErrorText(detail) || fallback;

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => errorMessageFromDetail(item, ""))
      .filter(Boolean);
    return messages.length ? messages.join(" ") : fallback;
  }

  if (typeof detail === "object") {
    const item = detail as ApiErrorItem;
    if (typeof item.msg === "string") return cleanApiErrorText(item.msg) || fallback;
    if (typeof item.message === "string") return cleanApiErrorText(item.message) || fallback;
    if (item.detail) return errorMessageFromDetail(item.detail, fallback);
  }

  return fallback;
}

export async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...authHeaders(), ...init?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorMessageFromDetail(err.detail, "Request failed"));
  }
  return res.json();
}

/* ── Auth ─────────────────────────────────────────────────────────────────── */

export async function login(email: string, password: string): Promise<string> {
  const data = await req<{ access_token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("admin_token", data.access_token);
  return data.access_token;
}

export async function requestPasswordReset(email: string): Promise<{ ok: boolean; message: string }> {
  return req<{ ok: boolean; message: string }>("/api/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string): Promise<{ ok: boolean }> {
  return req<{ ok: boolean }>("/api/auth/password/reset", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export function logout() {
  localStorage.removeItem("admin_token");
}

export function isLoggedIn(): boolean {
  return Boolean(getToken());
}

/* ── Articles ─────────────────────────────────────────────────────────────── */

export interface ArticlePayload {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string | null;
  category?: string;
  status: "draft" | "published";
  featured?: boolean;
  read_time?: number;
  published_at?: string;
  seo_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  pillar_id?: string | null;
  author_id?: string | null;
}

export async function adminListArticles(page = 1, per_page = 20, opts?: {
  status?: "draft" | "published";
  year?: string;
  month?: string;
  date_from?: string;
  date_to?: string;
  sort?: "asc" | "desc";
}) {
  const p = new URLSearchParams({ page: String(page), per_page: String(per_page) });
  if (opts?.status) p.set("status", opts.status);
  if (opts?.year) p.set("year", opts.year);
  if (opts?.month) p.set("month", opts.month);
  if (opts?.date_from) p.set("date_from", opts.date_from);
  if (opts?.date_to) p.set("date_to", opts.date_to);
  if (opts?.sort) p.set("sort", opts.sort);
  return req<{
    items: AdminArticle[];
    total: number;
    page: number;
    per_page: number;
    pages: number;
  }>(`/api/articles/admin/all?${p.toString()}`);
}

export async function adminGetArticle(id: string): Promise<AdminArticle> {
  return req<AdminArticle>(`/api/articles/admin/${id}`);
}

export async function adminCreateArticle(data: ArticlePayload): Promise<AdminArticle> {
  return req<AdminArticle>("/api/articles", { method: "POST", body: JSON.stringify(data) });
}

export async function adminUpdateArticle(id: string, data: Partial<ArticlePayload>): Promise<AdminArticle> {
  return req<AdminArticle>(`/api/articles/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function adminDeleteArticle(id: string): Promise<void> {
  await req(`/api/articles/${id}`, { method: "DELETE" });
}

/* ── Categories ───────────────────────────────────────────────────────────── */

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
}

export async function fetchCategories(): Promise<AdminCategory[]> {
  return req<AdminCategory[]>("/api/categories");
}

export async function createCategory(data: { name: string; slug: string }): Promise<AdminCategory> {
  return req<AdminCategory>("/api/categories", { method: "POST", body: JSON.stringify(data) });
}

export async function updateCategory(id: string, data: Partial<{ name: string; slug: string }>): Promise<AdminCategory> {
  return req<AdminCategory>(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteCategory(id: string): Promise<void> {
  await req(`/api/categories/${id}`, { method: "DELETE" });
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/api/uploads`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorMessageFromDetail(err.detail, "Upload gagal"));
  }
  const data = await res.json();
  return data.url as string;
}

export interface AdminArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  status: string;
  featured: boolean;
  read_time: number;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
  seo_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  pillar_id: string | null;
  author_id: string | null;
  author: Author | null;
}

/* ── Site Settings ────────────────────────────────────────────────────────── */

export interface SiteSettings {
  id: string;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  twitter_url: string | null;
  logo_url: string | null;
  logo_light_url: string | null;
  favicon_url: string | null;
  address: string | null;
  phone: string | null;
  clients_active: string | null;
  projects_completed: string | null;
  founded_year: string | null;
  primary_service_areas: string | null;
  response_time: string | null;
  show_testimonials: boolean | null;
  updated_at: string | null;
}

export async function fetchAdminSettings(): Promise<SiteSettings> {
  return req<SiteSettings>("/api/settings");
}

export async function updateSettings(data: Partial<Omit<SiteSettings, "id" | "updated_at">>): Promise<SiteSettings> {
  return req<SiteSettings>("/api/settings", { method: "PUT", body: JSON.stringify(data) });
}

/* ── Authors ──────────────────────────────────────────────────────────────── */

export interface Author {
  id: string;
  name: string;
  slug: string;
  role: string | null;
  bio: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  created_at: string;
}

export async function fetchAuthors(): Promise<Author[]> {
  return req<Author[]>("/api/authors");
}

export async function fetchAuthor(id: string): Promise<Author> {
  return req<Author>(`/api/authors/${id}`);
}

export async function createAuthor(data: Omit<Author, "id" | "created_at">): Promise<Author> {
  return req<Author>("/api/authors", { method: "POST", body: JSON.stringify(data) });
}

export async function updateAuthor(id: string, data: Partial<Omit<Author, "id" | "created_at">>): Promise<Author> {
  return req<Author>(`/api/authors/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteAuthor(id: string): Promise<void> {
  await req(`/api/authors/${id}`, { method: "DELETE" });
}

/* ── Integration Token ────────────────────────────────────────────────────── */

export interface IntegrationTokenInfo {
  id: string;
  created_at: string;
  token_prefix: string;
}

export async function fetchIntegrationToken(): Promise<IntegrationTokenInfo | null> {
  return req<IntegrationTokenInfo | null>("/api/integration/token");
}

export async function generateIntegrationToken(): Promise<IntegrationTokenInfo & { token: string }> {
  return req<IntegrationTokenInfo & { token: string }>("/api/integration/token", { method: "POST" });
}

export async function revokeIntegrationToken(): Promise<void> {
  await req("/api/integration/token", { method: "DELETE" });
}

/* ── Portfolio ────────────────────────────────────────────────────────────── */

export interface AdminPortfolioItem {
  id: string;
  service_slug: string;
  title: string;
  category: string | null;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export type PortfolioPayload = Omit<AdminPortfolioItem, "id" | "created_at">;

export async function adminListPortfolios(service_slug?: string): Promise<AdminPortfolioItem[]> {
  const p = service_slug ? `?service_slug=${encodeURIComponent(service_slug)}` : "";
  return req<AdminPortfolioItem[]>(`/api/portfolios${p}`);
}

export async function adminGetPortfolio(id: string): Promise<AdminPortfolioItem> {
  return req<AdminPortfolioItem>(`/api/portfolios/${id}`);
}

export async function adminCreatePortfolio(data: PortfolioPayload): Promise<AdminPortfolioItem> {
  return req<AdminPortfolioItem>("/api/portfolios", { method: "POST", body: JSON.stringify(data) });
}

export async function adminUpdatePortfolio(id: string, data: Partial<PortfolioPayload>): Promise<AdminPortfolioItem> {
  return req<AdminPortfolioItem>(`/api/portfolios/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function adminDeletePortfolio(id: string): Promise<void> {
  await req(`/api/portfolios/${id}`, { method: "DELETE" });
}
