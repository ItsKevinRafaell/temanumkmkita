"use client";

import { motion } from "framer-motion";

const words = "Bisnis kamu layak ditemukan online.".split(" ");

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-canvas pt-16">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 50, 0], y: [0, 40, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-accent/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 20, -40, 0], y: [0, -50, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 right-1/3 w-56 h-56 bg-accent/10 rounded-full blur-2xl"
        />
      </div>

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
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease: "easeOut" }}
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
            className="bg-accent text-brand-dark font-bold px-8 py-4 rounded-full text-lg hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-lg shadow-accent/30"
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

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-brand-dark/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-brand-dark/30 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
