"use client";

import { motion } from "framer-motion";
import BlobDecoration from "@/components/ui/BlobDecoration";

const words = "Bisnis kamu layak ditemukan online.".split(" ");

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Organic blobs */}
      <BlobDecoration position="top-right" size={480} opacity={0.13} shape={1} />
      <BlobDecoration position="bottom-left" size={360} opacity={0.09} shape={2} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-1.5 rounded-full mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-semibold text-brand-dark">Solusi Digital untuk UMKM Indonesia</span>
        </motion.div>

        {/* Headline word-by-word */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-brand-dark leading-tight mb-6">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.4, ease: "easeOut" }}
              className="inline-block mr-[0.25em]"
            >
              {word === "online." ? (
                <span className="text-accent">{word}</span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="text-xl text-brand-dark/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Kami bantu UMKM kamu punya website profesional, muncul di Google Maps,
          dan aktif di media sosial — tanpa ribet, tanpa teknikal.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://wa.me/6289501925395?text=Halo%2C+saya+ingin+konsultasi+gratis"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-lg shadow-accent/30"
          >
            Konsultasi Gratis →
          </a>
          <a
            href="/layanan"
            className="text-brand-dark font-semibold px-8 py-4 rounded-full border border-brand-dark/20 hover:border-brand-dark/40 transition-colors"
          >
            Lihat Layanan
          </a>
        </motion.div>
      </div>
    </section>
  );
}
