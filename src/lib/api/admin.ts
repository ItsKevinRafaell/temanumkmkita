const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.temanumkmkita.com";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("admin_token") ?? "";
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...authHeaders(), ...init?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  return res.json();
}

/* ── Auth ─────────────────────────────────────────────────────────────────── */

export async function login(username: string, password: string): Promise<string> {
  const data = await req<{ access_token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem("admin_token", data.access_token);
  return data.access_token;
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
  cover_image?: string;
  category?: string;
  status: "draft" | "published";
  featured?: boolean;
  read_time?: number;
  published_at?: string;
}

export async function adminListArticles(page = 1, per_page = 20) {
  return req<{
    items: AdminArticle[];
    total: number;
    page: number;
    per_page: number;
    pages: number;
  }>(`/api/articles/admin/all?page=${page}&per_page=${per_page}`);
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
    throw new Error(err.detail ?? "Upload gagal");
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
}
