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

export interface ContentPillar {
  id: string;
  niche: string;
  name: string;
  description: string | null;
  focus_keyword: string | null;
  position_x: number;
  position_y: number;
  created_at: string;
}

export interface ContentTopic {
  id: string;
  pillar_id: string | null;
  title: string;
  focus_keyword: string | null;
  search_volume: number | null;
  difficulty: number | null;
  notes: string | null;
  status: string;
  position_x: number;
  position_y: number;
  created_at: string;
}

export async function fetchPillars(): Promise<ContentPillar[]> {
  return req<ContentPillar[]>("/api/pillars");
}

export async function createPillar(data: { niche: string; name: string; description?: string; focus_keyword?: string }): Promise<ContentPillar> {
  return req<ContentPillar>("/api/pillars", { method: "POST", body: JSON.stringify(data) });
}

export async function updatePillar(id: string, data: Partial<{
  niche: string; name: string; description: string; focus_keyword: string;
  position_x: number; position_y: number;
}>): Promise<ContentPillar> {
  return req<ContentPillar>(`/api/pillars/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deletePillar(id: string): Promise<void> {
  await req(`/api/pillars/${id}`, { method: "DELETE" });
}

export async function fetchTopics(pillar_id?: string): Promise<ContentTopic[]> {
  const p = pillar_id ? `?pillar_id=${pillar_id}` : "";
  return req<ContentTopic[]>(`/api/topics${p}`);
}

export async function createTopic(data: {
  pillar_id?: string; title: string; focus_keyword?: string;
  search_volume?: number; difficulty?: number; notes?: string; status?: string;
}): Promise<ContentTopic> {
  return req<ContentTopic>("/api/topics", { method: "POST", body: JSON.stringify(data) });
}

export async function updateTopic(id: string, data: Partial<{
  pillar_id: string | null; title: string; focus_keyword: string;
  search_volume: number; difficulty: number; notes: string; status: string;
  position_x: number; position_y: number;
}>): Promise<ContentTopic> {
  return req<ContentTopic>(`/api/topics/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteTopic(id: string): Promise<void> {
  await req(`/api/topics/${id}`, { method: "DELETE" });
}
