"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Eye, Award, Search } from "lucide-react";

interface Props {
  namaUsaha: string;
  active: boolean;
}

// Kurva ranking: mulai page 5 (posisi ~48) -> naik ke ranking 1.
// Sumbu Y di-invert: nilai kecil = ranking bagus (atas).
const RANK_POINTS = [48, 42, 33, 24, 15, 8, 3, 1];
const MONTHS = ["Sekarang", "Bln 1", "Bln 2", "Bln 3", "Bln 4", "Bln 5", "Bln 6", "Bln 7"];
const AWARENESS = [8, 14, 22, 33, 45, 60, 78, 92];

function buildPath(values: number[], w: number, h: number, maxV: number, invert: boolean) {
  const n = values.length;
  return values
    .map((v, i) => {
      const x = (i / (n - 1)) * w;
      const ratio = v / maxV;
      const y = invert ? (ratio * h) : (h - ratio * h);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function SeoSimulation({ namaUsaha, active }: Props) {
  const [progress, setProgress] = useState(0);
  const nama = namaUsaha || "bisnismu";

  useEffect(() => {
    if (!active) return;
    setProgress(0);
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const W = 320;
  const H = 120;
  const rankPath = buildPath(RANK_POINTS, W, H, 50, true);
  const awarePath = buildPath(AWARENESS, W, H, 100, false);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-brand-dark/10 bg-white p-5 shadow-card">
        <div className="mb-1 flex items-center gap-2">
          <TrendingUp size={17} className="text-accent" />
          <h3 className="font-bold text-brand-dark">Kalau dikelola SEO — proyeksi 7 bulan</h3>
        </div>
        <p className="mb-4 text-sm text-brand-dark/55">
          Posisi <strong className="text-brand-dark/80">{nama}</strong> di pencarian Google,
          dari halaman 5 naik ke halaman 1.
        </p>

        {/* Grafik ranking */}
        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 140 }}>
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1={0} y1={H * g} x2={W} y2={H * g} stroke="currentColor" strokeWidth={0.5} className="text-brand-dark/8" />
            ))}
            <path d={rankPath} fill="none" stroke="#f5a700" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 1000, strokeDashoffset: 1000 - progress * 1000 }} />
            {RANK_POINTS.map((v, i) => {
              const x = (i / (RANK_POINTS.length - 1)) * W;
              const y = (v / 50) * H;
              const show = progress >= i / (RANK_POINTS.length - 1);
              return show ? <circle key={i} cx={x} cy={y} r={i === RANK_POINTS.length - 1 ? 4 : 2.5} fill="#f5a700" /> : null;
            })}
          </svg>
          <div className="mt-1 flex justify-between text-[10px] text-brand-dark/40">
            <span>Halaman 5</span>
            <span className="font-bold text-accent">Ranking #1 🏆</span>
          </div>
        </div>
      </div>

      {/* Metrik awareness & brand */}
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard icon={<Eye size={15} />} label="Dilihat orang" from="80/bln" to="2.400/bln" progress={progress} />
        <MetricCard icon={<Search size={15} />} label="Muncul di pencarian" from="Hal. 5" to="Hal. 1" progress={progress} />
        <MetricCard icon={<Award size={15} />} label="Brand dikenal" from="8%" to="92%" progress={progress} />
      </div>

      <div className="rounded-xl border border-brand-dark/10 bg-white p-4 shadow-card">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp size={15} className="text-accent" />
          <span className="text-sm font-bold text-brand-dark">Pertumbuhan awareness merek</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 90 }}>
          <defs>
            <linearGradient id="awareGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5a700" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#f5a700" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={`${awarePath} L${W},${H} L0,${H} Z`} fill="url(#awareGrad)"
            style={{ opacity: progress }} />
          <path d={awarePath} fill="none" stroke="#f5a700" strokeWidth={2} strokeLinecap="round"
            style={{ strokeDasharray: 1000, strokeDashoffset: 1000 - progress * 1000 }} />
        </svg>
        <div className="mt-1 flex justify-between text-[10px] text-brand-dark/40">
          <span>{MONTHS[0]}</span>
          <span>Bln 7</span>
        </div>
      </div>

      <p className="text-center text-[11px] text-brand-dark/40">
        ✦ Angka di atas adalah <strong>simulasi ilustratif</strong> pola pertumbuhan SEO pada umumnya —
        bukan garansi. Hasil nyata bergantung kondisi bisnis & persaingan.
      </p>
    </div>
  );
}

function MetricCard({ icon, label, from, to, progress }: { icon: React.ReactNode; label: string; from: string; to: string; progress: number }) {
  return (
    <div className="rounded-xl border border-brand-dark/10 bg-white p-4 text-center shadow-card">
      <span className="mx-auto mb-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/12 text-accent">
        {icon}
      </span>
      <p className="text-xs text-brand-dark/50">{label}</p>
      <div className="mt-1 flex items-center justify-center gap-1.5">
        <span className="text-xs text-brand-dark/40 line-through">{from}</span>
        <span className="text-brand-dark/30">→</span>
        <span className="font-extrabold text-brand-dark transition-opacity" style={{ opacity: 0.3 + progress * 0.7 }}>{to}</span>
      </div>
    </div>
  );
}
