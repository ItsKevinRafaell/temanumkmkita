const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.temanumkmkita.com";

export interface PublicPortfolioItem {
  id: string;
  service_slug: string;
  title: string;
  category: string | null;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export async function fetchPortfolios(service_slug: string): Promise<PublicPortfolioItem[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/portfolios?service_slug=${encodeURIComponent(service_slug)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
