const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.temanumkmkita.com";

export function buildPublicApiUrl(path: string): URL {
  const cleanPath = path.replace(/^\/+/, "");
  const browser = typeof window !== "undefined";
  const base = browser ? window.location.origin : API_BASE;
  const prefix = browser ? "/api/public" : "/api";

  return new URL(`${prefix}/${cleanPath}`, base);
}
