"use client";

import { motion, LazyMotion, domAnimation } from "framer-motion";

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

export default function AnimatedHeroCards() {
  return (
    <LazyMotion features={domAnimation}>
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
    </LazyMotion>
  );
}