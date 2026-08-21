"use client";

import { useEffect, useState } from "react";

interface Props {
  nama: string;
  jenis: string;
  kota: string;
}

/**
 * Preview web usaha — render dari 22 template ASLI (per-industri, token-based)
 * via backend /api/tools/render-preview, ditampilkan di <iframe srcdoc>.
 * Ini web beneran punya Teman UMKM Kita, bukan mockup generik.
 *
 * Isi ilustratif (telepon/rating/alamat) = contoh; nama & kota = data user.
 */
export default function WebPreview({ nama, jenis, kota }: Props) {
  const [html, setHtml] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(false);
    fetch("/api/tools/render-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama_usaha: nama, jenis_usaha: jenis, kota }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!alive) return;
        setHtml(d.html);
        setLabel(d.label || "");
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [nama, jenis, kota]);

  return (
    <div className="space-y-2">
      {/* Browser frame */}
      <div className="overflow-hidden rounded-xl border border-brand-dark/10 bg-white shadow-card">
        <div className="flex items-center gap-2 border-b border-brand-dark/10 bg-brand-dark/[0.03] px-3 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="ml-2 flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-brand-dark/8">
            <span className="truncate text-[11px] text-brand-dark/40">
              🔒 www.{(nama || "usahaku").toLowerCase().replace(/[^a-z0-9]+/g, "")}.com
            </span>
          </div>
        </div>

        <div className="relative h-[460px] w-full bg-white">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="h-8 w-8 animate-spin rounded-full border-3 border-accent/30 border-t-accent" />
              <p className="text-sm text-brand-dark/50">Menyiapkan tampilan webmu...</p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
              <p className="text-sm text-brand-dark/60">Gagal memuat preview. Coba lagi sebentar ya.</p>
            </div>
          )}
          {html && !error && (
            <iframe
              title="Preview web usaha"
              srcDoc={html}
              className="h-full w-full border-0"
              sandbox="allow-same-origin"
              loading="lazy"
            />
          )}
        </div>
      </div>

      <p className="text-center text-[11px] text-brand-dark/40">
        {label && <span className="font-semibold text-brand-dark/55">Template {label}. </span>}
        ✦ Isi (foto, telepon, testimoni) hanya contoh — versi asli pakai data & foto bisnismu
      </p>
    </div>
  );
}
