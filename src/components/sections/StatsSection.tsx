"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Users, CheckCircle2, Layers, Star, type LucideIcon } from "lucide-react";

interface StatItem {
  end: number;
  suffix: string;
  label: string;
  Icon: LucideIcon;
}

const stats: StatItem[] = [
  { end: 3, suffix: "", label: "Klien Aktif", Icon: Users },
  { end: 10, suffix: "+", label: "Proyek Selesai", Icon: CheckCircle2 },
  { end: 5, suffix: "", label: "Jenis Layanan", Icon: Layers },
  { end: 2025, suffix: "", label: "Tahun Berdiri", Icon: Star },
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
    <section className="relative overflow-hidden bg-accent py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="relative text-center">
              <StatCard stat={stat} />
              {i < stats.length - 1 && (
                <div className="absolute bottom-1/4 right-0 top-1/4 hidden w-px bg-white/20 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat }: { stat: StatItem }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const count = useCountUp(stat.end, 1500, inView);
  const { Icon } = stat;

  return (
    <div ref={ref}>
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
        <Icon size={22} className="text-white" />
      </div>
      <div className="text-4xl font-extrabold text-white sm:text-5xl">
        {count}
        <span className="text-white/80">{stat.suffix}</span>
      </div>
      <div className="mt-1 text-sm font-medium text-white/70">{stat.label}</div>
    </div>
  );
}
