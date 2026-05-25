"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const testimonials = [
  {
    name: "PT Maju Lestari Sejahtera",
    role: "SEO & Google Maps",
    avatar: "M",
    color: "#f5a700",
    text: "Setelah pakai layanan SEO Teman UMKM Kita, bisnis kami muncul di halaman pertama Google dalam 2 bulan. Pelanggan baru datang dari online, bukan cuma referral lagi.",
    short: "Halaman 1 Google dalam 2 bulan!",
    result: "Halaman 1 Google • 2 bulan",
  },
  {
    name: "Mitra Harmoni Kencana",
    role: "Web Development",
    avatar: "H",
    color: "#60a5fa",
    text: "Website kami yang lama lambat dan sering bermasalah. Tim Teman UMKM Kita rebuild dari awal — sekarang cepat, zero downtime, tidak pusing teknikal lagi.",
    short: "Website 3× lebih cepat, zero downtime.",
    result: "3× lebih cepat • Zero downtime",
  },
  {
    name: "Batik Nusantara Online",
    role: "Social Media Management",
    avatar: "B",
    color: "#a78bfa",
    text: "Konten sosmed kami sekarang konsisten, tim bantu kami membangun brand kuat di Instagram dan TikTok. Engagement naik signifikan dalam waktu singkat.",
    short: "Engagement 5× lipat dalam 3 bulan.",
    result: "Engagement naik 5× • 3 bulan",
  },
  {
    name: "CV Karya Mandiri Makmur",
    role: "SEO Content Writing",
    avatar: "K",
    color: "#fb7185",
    text: "Blog perusahaan mendatangkan ratusan pengunjung organik per hari. Konten yang dibuat sangat relevan dan efektif untuk SEO jangka panjang.",
    short: "Traffic organik +200% dari konten blog.",
    result: "Traffic organik +200% • 4 bulan",
  },
];

type Testimonial = (typeof testimonials)[0];

// 4 surrounding slot positions + 3D tilt config
const slots = [
  {
    className: "top-[6%] left-0",
    tilt: { rotateY: 14, rotateX: -8, rotateZ: -1.5, scale: 0.82 },
  },
  {
    className: "top-[6%] right-0",
    tilt: { rotateY: -14, rotateX: -8, rotateZ: 1.5, scale: 0.82 },
  },
  {
    className: "bottom-[6%] left-0",
    tilt: { rotateY: 11, rotateX: 9, rotateZ: 2, scale: 0.77 },
  },
  {
    className: "bottom-[6%] right-0",
    tilt: { rotateY: -11, rotateX: 9, rotateZ: -2, scale: 0.77 },
  },
];

function SmallCard({ t, onClick }: { t: Testimonial; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white/85 backdrop-blur-sm border border-brand-dark/8 rounded-2xl p-4 card-shadow"
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: t.color }}
        >
          {t.avatar}
        </div>
        <div className="min-w-0">
          <div className="font-bold text-brand-dark text-xs leading-tight line-clamp-1">{t.name}</div>
          <div className="text-brand-dark/45 text-[10px]">{t.role}</div>
        </div>
      </div>
      <p className="text-brand-dark/60 text-[11px] leading-relaxed line-clamp-2">
        &ldquo;{t.short}&rdquo;
      </p>
      <div className="mt-2.5 inline-flex items-center gap-1 bg-accent/10 text-accent text-[10px] font-semibold px-2 py-0.5 rounded-full">
        ✓ {t.result}
      </div>
    </button>
  );
}

function CenterCard({ t }: { t: Testimonial }) {
  return (
    <div className="relative bg-white/90 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-3xl p-8 sm:p-10 overflow-hidden">
      <span className="absolute top-4 right-6 text-7xl text-brand-dark/5 font-serif leading-none select-none">
        &rdquo;
      </span>
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
          style={{ background: t.color }}
        >
          {t.avatar}
        </div>
        <div>
          <div className="font-bold text-brand-dark">{t.name}</div>
          <div className="text-sm font-semibold" style={{ color: t.color }}>{t.role}</div>
        </div>
      </div>
      <blockquote className="text-brand-dark/70 text-lg leading-relaxed mb-6">
        &ldquo;{t.text}&rdquo;
      </blockquote>
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/25 px-4 py-2 rounded-full">
          <span className="text-accent text-sm">✓</span>
          <span className="text-accent text-sm font-semibold">{t.result}</span>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialSection() {
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  useEffect(() => {
    const timer = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 5500);
    return () => clearInterval(timer);
  }, []);

  const mainT = testimonials[active];
  const surroundTs = [1, 2, 3, 4].map((i) => testimonials[(active + i) % testimonials.length]);

  return (
    <section ref={ref} className="pt-4 pb-24 bg-transparent relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider">
            Kata Klien Kami
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mt-3">
            Mereka sudah merasakan
            <br />
            <span className="text-accent">hasilnya</span>
          </h2>
        </motion.div>

        {/* ── Desktop: 3D cluster ─────────────────────────────────────────── */}
        <motion.div
          className="hidden lg:block relative py-28 min-h-[560px]"
          style={{ perspective: "1500px" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* 4 surrounding cards */}
          {surroundTs.map((t, i) => (
            <motion.div
              key={i}
              className={`absolute w-52 ${slots[i].className}`}
              animate={{
                rotateY: slots[i].tilt.rotateY,
                rotateX: slots[i].tilt.rotateX,
                rotateZ: slots[i].tilt.rotateZ,
                scale: slots[i].tilt.scale,
                opacity: 0.88,
              }}
              whileHover={{
                rotateY: slots[i].tilt.rotateY * 0.25,
                rotateX: slots[i].tilt.rotateX * 0.25,
                rotateZ: 0,
                scale: 0.88,
                opacity: 1,
              }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <SmallCard t={t} onClick={() => setActive(testimonials.indexOf(t))} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Center card */}
          <div className="relative z-10 max-w-md mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <CenterCard t={mainT} />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Mobile: single card ──────────────────────────────────────────── */}
        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CenterCard t={mainT} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots nav */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "bg-accent w-6" : "bg-brand-dark/15 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
