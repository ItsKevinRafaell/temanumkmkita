"use client";

import { motion } from "framer-motion";
import BlobDecoration from "@/components/ui/BlobDecoration";

const words = "Bisnis kamu layak ditemukan online.".split(" ");

const floatingCards = [
  {
    avatar: "M",
    color: "#f5a700",
    name: "PT Maju Lestari",
    tag: "SEO",
    result: "Halaman 1 Google",
    sub: "dalam 2 bulan",
    floatY: [0, -10, 0],
    delay: 0,
    duration: 3.8,
    pos: "top-[22%] left-6",
  },
  {
    avatar: "S",
    color: "#34d399",
    name: "Warung Bu Sulasmi",
    tag: "Google Maps",
    result: "+40% pelanggan baru",
    sub: "per bulan",
    floatY: [0, 10, 0],
    delay: 0.6,
    duration: 4.2,
    pos: "top-[22%] right-6",
  },
  {
    avatar: "H",
    color: "#60a5fa",
    name: "Mitra Harmoni",
    tag: "Website",
    result: "3× lebih cepat",
    sub: "zero downtime",
    floatY: [0, -7, 0],
    delay: 1.1,
    duration: 3.5,
    pos: "bottom-[22%] left-6",
  },
  {
    avatar: "B",
    color: "#a78bfa",
    name: "Batik Nusantara",
    tag: "Social Media",
    result: "Engagement 5×",
    sub: "dalam 3 bulan",
    floatY: [0, 8, 0],
    delay: 0.4,
    duration: 4.5,
    pos: "bottom-[22%] right-6",
  },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <BlobDecoration position="top-right" size={480} opacity={0.13} shape={1} />
      <BlobDecoration position="bottom-left" size={360} opacity={0.09} shape={2} />

      {/* Floating 3D proof cards — desktop only */}
      {floatingCards.map((card, i) => (
        <motion.div
          key={i}
          className={`hidden xl:block absolute ${card.pos} w-48 z-20 pointer-events-none`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 + i * 0.15, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: card.floatY }}
            transition={{
              repeat: Infinity,
              duration: card.duration,
              ease: "easeInOut",
              delay: card.delay,
            }}
            whileHover={{ rotateY: 8, rotateX: -4, scale: 1.04 }}
            style={{ transformStyle: "preserve-3d" }}
            className="bg-white/90 backdrop-blur-sm border border-brand-dark/8 rounded-2xl p-3.5 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                style={{ background: card.color }}
              >
                {card.avatar}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-brand-dark text-xs leading-tight truncate">{card.name}</div>
                <div className="text-brand-dark/40 text-[10px]">{card.tag}</div>
              </div>
            </div>
            <div className="text-brand-dark text-xs font-bold leading-snug">{card.result}</div>
            <div className="text-brand-dark/50 text-[10px] mt-0.5">{card.sub}</div>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-[9px] font-bold text-accent">✓ Terbukti</span>
            </div>
          </motion.div>
        </motion.div>
      ))}

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
