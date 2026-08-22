"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Monitor, Smartphone, RefreshCw } from "lucide-react";

interface Props {
  nama: string;
  kota: string;
  industrySlug: string;
  label: string;
}

type View = "desktop" | "mobile";

// Live render SATU template terpilih (industrySlug) via POST /api/tools/render-preview.
// Passing slug sebagai jenis_usaha -> backend detect_industry exact-match slug -> template itu.
// Toggle DESKTOP (iframe full-width) vs MOBILE (~375px dalam frame HP).
// Render dipanggil sekali per slug (di-cache di parent lewat key), hormati rate limit.
export default function TemplatePreview({ nama, kota, industrySlug, label }: Props) {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState<View>("desktop");
  const reqId = useRef(0);

  function load() {
    const id = ++reqId.current;
    setLoading(true);
    setError(false);
    fetch("/api/tools/render-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // slug sbg jenis_usaha -> exact-match industri di backend.
      body: JSON.stringify({ nama_usaha: nama, jenis_usaha: industrySlug, kota }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (id !== reqId.current) return;
        setHtml(d.html);
        setLoading(false);
      })
      .catch(() => {
        if (id !== reqId.current) return;
        setError(true);
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [industrySlug, nama, kota]);

  const domain = `www.${(nama || "usahaku").toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`;

  return (
    <div className="space-y-3">
      {/* Toggle desktop / mobile */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-brand-dark">
          Preview: <span className="text-accent">{label}</span>
        </p>
        <div className="inline-flex rounded-lg border border-brand-dark/12 bg-white p-0.5">
          <button
            type="button"
            onClick={() => setView("desktop")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
              view === "desktop" ? "bg-accent text-white" : "text-brand-dark/60 hover:text-brand-dark"
            }`}
          >
            <Monitor size={14} /> Desktop
          </button>
          <button
            type="button"
            onClick={() => setView("mobile")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
              view === "mobile" ? "bg-accent text-white" : "text-brand-dark/60 hover:text-brand-dark"
            }`}
          >
            <Smartphone size={14} /> Mobile
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="rounded-xl border border-brand-dark/10 bg-brand-dark/[0.03] p-3 sm:p-5">
        {error ? (
          <div className="flex h-[420px] flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-brand-dark/60">Gagal memuat preview. Coba lagi ya.</p>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-dark/15 px-4 py-2 text-sm font-bold text-brand-dark transition-colors hover:border-accent/40"
            >
              <RefreshCw size={14} /> Coba lagi
            </button>
          </div>
        ) : view === "desktop" ? (
          <div className="overflow-hidden rounded-lg border border-brand-dark/10 bg-white shadow-card">
            <div className="flex items-center gap-2 border-b border-brand-dark/10 bg-brand-dark/[0.03] px-3 py-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
              <div className="ml-2 flex flex-1 items-center rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-brand-dark/8">
                <span className="truncate text-[11px] text-brand-dark/40">🔒 {domain}</span>
              </div>
            </div>
            <div className="relative h-[460px] w-full bg-white">
              {loading ? (
                <PreviewLoader />
              ) : (
                html && (
                  <iframe
                    title={`Preview ${label} (desktop)`}
                    srcDoc={html}
                    className="h-full w-full border-0"
                    sandbox="allow-same-origin"
                  />
                )
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            {/* Phone frame ~375px */}
            <div className="w-[375px] max-w-full overflow-hidden rounded-[2rem] border-[6px] border-brand-dark/80 bg-brand-dark/80 shadow-xl">
              <div className="flex justify-center bg-brand-dark/80 py-1.5">
                <span className="h-1 w-16 rounded-full bg-white/30" />
              </div>
              <div className="relative h-[560px] w-full overflow-hidden bg-white">
                {loading ? (
                  <PreviewLoader />
                ) : (
                  html && (
                    <iframe
                      title={`Preview ${label} (mobile)`}
                      srcDoc={html}
                      className="h-full w-full border-0"
                      sandbox="allow-same-origin"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-[11px] text-brand-dark/40">
        ✦ Isi (foto, telepon, testimoni) hanya contoh — versi asli pakai data &amp; foto bisnismu.
      </p>
    </div>
  );
}

function PreviewLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <Loader2 size={26} className="animate-spin text-accent" />
      <p className="text-sm text-brand-dark/50">Menyiapkan tampilan webmu...</p>
    </div>
  );
}
