import { type NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.temanumkmkita.com";
const ALLOWED_RESOURCES = new Set(["articles", "authors", "categories", "portfolios", "settings"]);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest, { params }: { params: { path?: string[] } }) {
  const path = params.path ?? [];

  if (path.length === 0 || !ALLOWED_RESOURCES.has(path[0])) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }

  const upstream = new URL(`/api/${path.map(encodeURIComponent).join("/")}`, API_BASE);
  request.nextUrl.searchParams.forEach((value, key) => {
    upstream.searchParams.append(key, value);
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(upstream.toString(), {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { detail: "Failed to fetch public content" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  } finally {
    clearTimeout(timeout);
  }
}
