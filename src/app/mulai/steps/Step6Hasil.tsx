"use client";

import { TrendingUp } from "lucide-react";
import type { StepProps } from "../types";
import SeoSimulation from "@/app/tools/preview-bisnis/SeoSimulation";

// Step 6 — Hasil kalau dioptimasi.
// "Ini masa depan bisnismu kalau dioptimasi" -> grafik naik (page 5 -> #1), awareness.
// Reuse SeoSimulation (existing) + counter animation. Ilustratif, ga janji angka pasti.
// CTA "Aku mau ini" -> next. Data: none.
export default function Step6Hasil({ state }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
          <TrendingUp size={13} /> Masa depan usahamu
        </span>
        <h2 className="text-2xl font-extrabold text-brand-dark">
          Ini masa depan bisnismu kalau dioptimasi
        </h2>
        <p className="mt-1 text-brand-dark/60">
          Web + profil Google yang dikelola SEO bikin{" "}
          {state.namaUsaha.trim() || "usahamu"} pelan-pelan naik dari halaman 5 ke
          halaman 1 — makin banyak orang nemu &amp; kenal kamu.
        </p>
      </div>

      <SeoSimulation namaUsaha={state.namaUsaha} active={true} />

      <p className="text-sm font-bold text-accent">
        Kalau kamu mau hasil kayak gini buat usahamu — lanjut ke langkah terakhir →
      </p>
    </div>
  );
}
