import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

// Dynamic favicon route — mirrors the pattern that works on KantorTeman.
// Browsers and Vercel's CDN lock onto static /favicon.ico hard; renaming + query
// strings can't reliably bust it. A force-dynamic, revalidate=0 API route is
// never served from the static edge cache, so the browser always re-fetches
// the live asset.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const FAVICON_PATHS = ["favicon-v5.ico", "favicon.ico", "brand/favicon-96.png"];

export async function GET() {
  const cc = "public, max-age=300, must-revalidate";
  for (const rel of FAVICON_PATHS) {
    try {
      const buf = await fs.readFile(path.join(process.cwd(), "public", rel));
      const isIco = rel.endsWith(".ico");
      const contentType = isIco ? "image/x-icon" : "image/png";
      return new NextResponse(buf, {
        headers: { "Content-Type": contentType, "Cache-Control": cc },
      });
    } catch {
      /* try next */
    }
  }
  return new NextResponse(null, { status: 404 });
}
