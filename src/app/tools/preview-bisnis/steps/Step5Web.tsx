"use client";

import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import type { StepProps } from "../types";
import TemplatePreview from "./TemplatePreview";

// Step 5 — Bikin web (SIMPLIFIED per koreksi Kevin).
// Industri sudah dipilih di Step 2 -> di sini LANGSUNG render template yang cocok
// (auto, tanpa galeri pilih-template). Tetap ada toggle DESKTOP/MOBILE (di TemplatePreview).
// templateSlug di-set otomatis dari industrySlug step 2.
export default function Step5Web({ state, update }: StepProps) {
  const slug = state.industrySlug.trim();
  const jenisLabel = state.jenisUsaha.trim() || "usahamu";

  // Simpan template terpilih = industri step 2 (auto).
  useEffect(() => {
    if (slug && state.templateSlug !== slug) {
      update({ templateSlug: slug });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <div className="space-y-5">
      <div>
        <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent/12 px-3 py-1 text-xs font-bold text-accent">
          <Sparkles size={13} /> Solusinya
        </span>
        <h2 className="text-2xl font-extrabold text-brand-dark">
          Nih, web yang bisa jadi milik {jenisLabel}
        </h2>
        <p className="mt-1 text-brand-dark/60">
          Kami langsung siapin tampilan web yang pas buat{" "}
          <strong className="text-brand-dark/80">{jenisLabel}</strong> — lengkap
          sama nama usahamu. Coba geser toggle di bawah buat lihat gimana rapinya
          di layar HP maupun laptop.
        </p>
      </div>

      {slug ? (
        <TemplatePreview
          nama={state.namaUsaha}
          kota={state.kota}
          industrySlug={slug}
          label={jenisLabel}
        />
      ) : (
        <div className="rounded-xl border border-brand-dark/10 bg-brand-dark/[0.03] p-8 text-center text-sm text-brand-dark/55">
          Balik ke langkah sebelumnya buat pilih jenis usahamu dulu ya, biar kami
          bisa nunjukin template yang paling cocok.
        </div>
      )}

      <p className="text-sm text-brand-dark/55">
        Web sekeren ini bikin usahamu langsung keliatan profesional &amp; gampang
        dipercaya. Tapi web aja belum cukup — biar orang beneran nemuin kamu…
      </p>
    </div>
  );
}
