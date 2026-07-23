import { type NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.temanumkmkita.com";
const ALLOWED_TOOLS = new Set(["generate-profil"]);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest, { params }: { params: { path?: string[] } }) {
  const path = params.path ?? [];

  if (path.length === 0 || !ALLOWED_TOOLS.has(path[0])) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }

  const upstream = new URL(`/api/tools/${path.map(encodeURIComponent).join("/")}`, API_BASE);

  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }

  // AI generate bisa 20-30 detik. Kasih ruang 50s.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 50000);

  try {
    const response = await fetch(upstream.toString(), {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body,
      signal: controller.signal,
    });
    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { detail: "Gagal terhubung ke server. Coba lagi." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  } finally {
    clearTimeout(timeout);
  }
}
