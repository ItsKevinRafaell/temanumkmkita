"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import type { StepProps } from "../types";

// Step 1 — Hook (masalah).
// Full-bleed, headline stagger fade-in. CTA tunggal "Cek punyaku" -> next.
// PLAN: "Tiap hari orang cari [jenis usaha] di [kota]-mu di Google. Kamu muncul ga?"
// Data: none. (jenis usaha & kota belum diisi di sini -> placeholder ilustratif)
export default function Step1Hook({ state }: StepProps) {
  const jenis = state.jenisUsaha.trim() || "usaha kayak kamu";
  const kota = state.kota.trim() || "kotamu";

  const lines = [
    "Tiap hari orang nyari",
    `${jenis} di ${kota}`,
    "lewat Google.",
    "Kamu muncul ga?",
  ];

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent/12 px-4 py-1.5 text-sm font-bold text-accent"
      >
        <Search size={15} /> Realita usaha di era Google
      </motion.span>

      <h1 className="max-w-xl text-3xl font-extrabold leading-tight text-brand-dark sm:text-4xl">
        {lines.map((line, i) => (
          <motion.span
            key={i}
            className="block"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.18, duration: 0.4 }}
          >
            {line}
          </motion.span>
        ))}
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-6 max-w-md text-brand-dark/60"
      >
        Kalau usahamu belum kelihatan, pelanggan itu lari ke kompetitor. Yuk kita
        cek bareng kondisi usahamu sekarang.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="mt-8 text-sm font-bold text-accent"
      >
        Klik &quot;Cek punyaku&quot; di bawah untuk mulai →
      </motion.p>
    </div>
  );
}
