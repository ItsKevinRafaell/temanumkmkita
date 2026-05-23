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
  { end: 50, suffix: "+", label: "Klien Aktif", Icon: Users },
  { end: 120, suffix: "+", label: "Proyek Selesai", Icon: CheckCircle2 },
  { end: 5, suffix: "", label: "Jenis Layanan", Icon: Layers },
  { end: 100, suffix: "%", label: "Kepuasan Klien", Icon: Star },
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
    <section className="py-16 bg-accent relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="relative text-center">
              <StatCard stat={stat} />
              {i < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/4 bottom-1/4 w-px bg-white/20" />
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
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3 mx-auto">
        <Icon size={22} className="text-white" />
      </div>
      <div className="text-4xl sm:text-5xl font-extrabold text-white">
        {count}
        <span className="text-white/80">{stat.suffix}</span>
      </div>
      <div className="text-sm font-medium text-white/70 mt-1">{stat.label}</div>
    </div>
  );
}
