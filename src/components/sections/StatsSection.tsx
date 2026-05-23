"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface StatItem {
  end: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { end: 50, suffix: "+", label: "Klien Aktif" },
  { end: 120, suffix: "+", label: "Proyek Selesai" },
  { end: 5, suffix: "", label: "Jenis Layanan" },
  { end: 100, suffix: "%", label: "Kepuasan Klien" },
];

function useCountUp(end: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, active]);

  return count;
}

export default function StatsSection() {
  return (
    <section className="py-16 bg-brand-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <StatCardWhite stat={stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCardWhite({ stat }: { stat: StatItem }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const count = useCountUp(stat.end, 1500, inView);

  return (
    <div ref={ref}>
      <div className="text-4xl sm:text-5xl font-extrabold text-white">
        {count}
        <span className="text-accent">{stat.suffix}</span>
      </div>
      <div className="text-sm font-medium text-white/50 mt-1">{stat.label}</div>
    </div>
  );
}
