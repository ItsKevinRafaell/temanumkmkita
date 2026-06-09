import { buildPublicApiUrl } from "@/lib/api/public";

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
    const url = buildPublicApiUrl("portfolios");
    url.searchParams.set("service_slug", service_slug);

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
