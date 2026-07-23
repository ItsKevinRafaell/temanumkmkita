"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Sparkles, ArrowRight, Store, Tag, MessageSquare } from "lucide-react";
import Link from "next/link";

const previewItems = [
  { icon: MessageSquare, label: "Deskripsi bisnis siap tempel" },
  { icon: Tag, label: "12-15 keyword pencarian lokal" },
  { icon: Store, label: "Template balasan review" },
];

export default function ToolsHighlightSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-canvas py-24">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-accent/25 bg-white shadow-card"
        >
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left: copy */}
            <div className="p-8 sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-bold text-accent">
                <Sparkles size={15} /> Tool Gratis
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-brand-dark sm:text-4xl">
                Bikin Profil Google Bisnismu Terlihat Profesional
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-brand-dark/60">
                Isi nama, jenis, dan kota usahamu. Dalam 30 detik kamu dapat deskripsi, keyword, dan
                template balasan review yang <strong className="text-brand-dark/80">tinggal tempel</strong>{" "}
                ke Google Business Profile. Gratis, tanpa daftar.
              </p>

              <Link
                href="/tools/profil-google"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-bold text-white transition-all hover:bg-accent/90 hover:shadow-md"
              >
                <Sparkles size={18} /> Coba Sekarang, Gratis <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right: preview list */}
            <div className="border-t border-brand-dark/10 bg-canvas p-8 sm:p-10 lg:border-l lg:border-t-0">
              <p className="text-sm font-bold uppercase tracking-wider text-brand-dark/40">
                Yang kamu dapat
              </p>
              <div className="mt-4 space-y-3">
                {previewItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 12 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                      className="flex items-center gap-3 rounded-lg border border-brand-dark/10 bg-white p-3.5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <Icon size={17} className="text-accent" />
                      </span>
                      <span className="text-sm font-medium text-brand-dark/75">{item.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
