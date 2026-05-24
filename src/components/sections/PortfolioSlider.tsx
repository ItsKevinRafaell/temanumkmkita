"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Globe, ChevronLeft, ChevronRight } from "lucide-react";

export interface PortfolioItem {
  name: string;
  category: string;
  plan: string;
  accent: string;
}

export default function PortfolioSlider({ items }: { items: PortfolioItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  function scroll(dir: "left" | "right") {
    trackRef.current?.scrollBy({
      left: dir === "right" ? 312 : -312,
      behavior: "smooth",
    });
  }

  return (
    <div ref={ref} className="relative">
      {/* Prev */}
      <button
        onClick={() => scroll("left")}
        aria-label="Sebelumnya"
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-white border border-brand-dark/10 card-shadow items-center justify-center text-brand-dark/40 hover:text-brand-dark hover:shadow-lg transition-all duration-200"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="flex-shrink-0 w-72 bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-2xl overflow-hidden"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className={`h-44 ${item.accent} border-b border-brand-dark/6 flex items-center justify-center relative`}>
              <Globe size={36} className="text-brand-dark/15" />
              <div className="absolute top-3 right-3">
                <span className="bg-white/80 backdrop-blur-sm text-brand-dark/50 text-xs font-semibold px-2.5 py-1 rounded-full border border-brand-dark/8">
                  {item.plan}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="text-xs text-accent font-bold uppercase tracking-wider mb-1">{item.category}</div>
              <div className="font-bold text-brand-dark">{item.name}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => scroll("right")}
        aria-label="Berikutnya"
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-white border border-brand-dark/10 card-shadow items-center justify-center text-brand-dark/40 hover:text-brand-dark hover:shadow-lg transition-all duration-200"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
