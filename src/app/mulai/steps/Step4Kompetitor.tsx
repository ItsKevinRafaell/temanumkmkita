"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowUp, ArrowDown, Store } from "lucide-react";
import type { StepProps } from "../types";

// Step 4 — Ancaman kompetitor.
// "Ini yang kejadian kalau kompetitor naik & kamu ga muncul."
// Animasi GENERIK ILUSTRATIF (no real competitor API): kompetitor naik posisi,
// usaha user ke-geser turun/ilang. Emosi: takut ketinggalan.
// CTA "Gimana biar ga gitu?" -> next. Data: none.

interface Rank {
  id: string;
  name: string;
  isYou: boolean;
}

// State awal: user di atas. Setelah animasi: kompetitor naik, user tergeser turun.
const BEFORE: Rank[] = [
  { id: "you", name: "", isYou: true },
  { id: "c1", name: "Kompetitor A", isYou: false },
  { id: "c2", name: "Kompetitor B", isYou: false },
  { id: "c3", name: "Kompetitor C", isYou: false },
];

const AFTER: Rank[] = [
  { id: "c1", name: "Kompetitor A", isYou: false },
  { id: "c2", name: "Kompetitor B", isYou: false },
  { id: "c3", name: "Kompetitor C", isYou: false },
  { id: "you", name: "", isYou: true },
];

export default function Step4Kompetitor({ state }: StepProps) {
  const [shifted, setShifted] = useState(false);
  const namaUsaha = state.namaUsaha.trim() || "Usahamu";

  useEffect(() => {
    const t = setTimeout(() => setShifted(true), 900);
    return () => clearTimeout(t);
  }, []);

  const order = shifted ? AFTER : BEFORE;

  return (
    <div className="space-y-5">
      <div>
        <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
          <AlertTriangle size={13} /> Ancaman nyata
        </span>
        <h2 className="text-2xl font-extrabold text-brand-dark">
          Ini yang kejadian kalau kompetitor naik &amp; kamu diam
        </h2>
        <p className="mt-1 text-brand-dark/60">
          Setiap kompetitor yang aktif di Google pelan-pelan naik posisi. Kalau
          kamu nggak ikut, posisimu bakal tergeser turun — sampai hampir nggak
          kelihatan.
        </p>
      </div>

      {/* Animasi peringkat (ilustratif) */}
      <div className="space-y-2 rounded-xl border border-brand-dark/10 bg-canvas p-4">
        {order.map((r, i) => (
          <motion.div
            key={r.id}
            layout
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
              r.isYou
                ? "border-accent/50 bg-accent/5"
                : "border-brand-dark/8 bg-white"
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                r.isYou
                  ? "bg-accent/15 text-accent"
                  : "bg-brand-dark/8 text-brand-dark/50"
              }`}
            >
              {i + 1}
            </span>
            <span className="flex items-center gap-2 font-bold text-brand-dark">
              {r.isYou && <Store size={15} className="text-accent" />}
              {r.isYou ? namaUsaha : r.name}
            </span>
            {r.isYou && (
              <span className="ml-auto">
                {shifted ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                    <ArrowDown size={13} /> tergeser turun
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                    <ArrowUp size={13} /> masih di atas
                  </span>
                )}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      <p className="text-sm text-brand-dark/55">
        ✦ Ilustrasi pola persaingan pada umumnya — bukan data kompetitor asli.
        Kabar baiknya: posisimu masih bisa direbut balik.
      </p>
    </div>
  );
}
