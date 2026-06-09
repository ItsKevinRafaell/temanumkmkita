"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Globe, ChevronLeft, ChevronRight } from "lucide-react";

export interface PortfolioItem {
  name: string;
  category: string;
  image_url?: string;
  accent?: string;
  plan?: string;
}

const AUTO_MS = 3500;
const SCROLL_PX = 312; // card 288px + gap 24px

export default function PortfolioSlider({ items }: { items: PortfolioItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const scrollDir = useCallback((dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    if (dir === "right" && el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir === "right" ? SCROLL_PX : -SCROLL_PX, behavior: "smooth" });
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => scrollDir("right"), AUTO_MS);
  }, [scrollDir]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  function handleClick(dir: "left" | "right") {
    scrollDir(dir);
    resetTimer();
  }

  const btnClass =
    "hidden md:flex flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-brand-dark/10 card-shadow items-center justify-center text-brand-dark/40 hover:text-brand-dark hover:shadow-lg transition-all duration-200";

  return (
    <div ref={ref} className="flex items-center gap-4">
      {/* Prev */}
      <button onClick={() => handleClick("left")} aria-label="Sebelumnya" className={btnClass}>
        <ChevronLeft size={18} />
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex-1 flex gap-6 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="flex-shrink-0 w-72 bg-white border border-brand-dark/8 card-shadow rounded-lg overflow-hidden"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className={`h-44 ${item.accent ?? "bg-orange-50 border-orange-100"} border-b border-brand-dark/6 flex items-center justify-center relative overflow-hidden`}>
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="288px"
                />
              ) : (
                <Globe size={36} className="text-brand-dark/15" />
              )}
              {item.plan && (
                <div className="absolute top-3 right-3">
                  <span className="bg-white/80 backdrop-blur-sm text-brand-dark/50 text-xs font-semibold px-2.5 py-1 rounded-md border border-brand-dark/8">
                    {item.plan}
                  </span>
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="text-xs text-accent font-bold uppercase tracking-wider mb-1">{item.category}</div>
              <div className="font-bold text-brand-dark">{item.name}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next */}
      <button onClick={() => handleClick("right")} aria-label="Berikutnya" className={btnClass}>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
