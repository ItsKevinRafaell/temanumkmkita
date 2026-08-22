"use client";

import { MapPin } from "lucide-react";
import type { StepProps } from "../types";
import GbpPreview from "@/app/tools/preview-bisnis/GbpPreview";

// Step 3 — Realita GBP.
// "Ini yang orang lihat pas nyari kamu di Google" -> render GbpPreview (existing).
// Narasi kenapa GBP penting = ILUSTRATIF (bukan angka statistik ngawur).
// CTA "Terus?" -> next. Data: none.
export default function Step3Gbp({ state }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent/12 px-3 py-1 text-xs font-bold text-accent">
          <MapPin size={13} /> Realita di Google
        </span>
        <h2 className="text-2xl font-extrabold text-brand-dark">
          Ini yang orang lihat pas nyari kamu di Google
        </h2>
        <p className="mt-1 text-brand-dark/60">
          Waktu calon pelanggan ngetik &quot;{state.jenisUsaha.trim() || "usahamu"} di{" "}
          {state.kota.trim() || "kotamu"}&quot;, beginilah tampilannya. Profil yang
          rapi bikin orang percaya sebelum mereka datang.
        </p>
      </div>

      <GbpPreview
        namaUsaha={state.namaUsaha}
        jenisUsaha={state.jenisUsaha}
        kota={state.kota}
        loading={false}
      />

      <p className="text-sm text-brand-dark/55">
        Profil yang lengkap &amp; aktif bikin usahamu lebih gampang ditemukan dan
        dipercaya. Tapi ada satu hal yang bikin ini makin genting…
      </p>
    </div>
  );
}
