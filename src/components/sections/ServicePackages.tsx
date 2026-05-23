"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import type { Package } from "@/lib/data/services";

interface Props {
  packages: Package[];
}

export default function ServicePackages({ packages }: Props) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 bg-canvas">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider">Paket & Harga</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark mt-3">
            Pilih yang sesuai bisnismu
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className={cn(
                "rounded-2xl p-8 relative",
                pkg.highlighted
                  ? "bg-brand-dark text-white ring-2 ring-accent scale-105"
                  : "bg-white border border-brand-dark/10"
              )}
            >
              {pkg.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-brand-dark text-xs font-bold px-4 py-1 rounded-full">
                  Paling Populer
                </div>
              )}

              <div className={cn("font-bold text-lg mb-1", pkg.highlighted ? "text-white" : "text-brand-dark")}>
                {pkg.name}
              </div>
              <div className={cn("text-3xl font-extrabold mb-1", pkg.highlighted ? "text-accent" : "text-brand-dark")}>
                {pkg.price}
              </div>
              {pkg.period && (
                <div className={cn("text-sm mb-6", pkg.highlighted ? "text-white/60" : "text-brand-dark/50")}>
                  {pkg.period}
                </div>
              )}

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span className="text-accent font-bold mt-0.5">✓</span>
                    <span className={pkg.highlighted ? "text-white/80" : "text-brand-dark/70"}>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://wa.me/6289501925395?text=Halo%2C+saya+tertarik+dengan+paket"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "block text-center font-bold py-3 rounded-full transition-colors",
                  pkg.highlighted
                    ? "bg-accent text-brand-dark hover:bg-accent/90"
                    : "border border-brand-dark/20 text-brand-dark hover:border-brand-dark/40"
                )}
              >
                Pilih Paket Ini
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center text-brand-dark/50 text-sm mt-8"
        >
          Butuh paket custom? <a href="https://wa.me/6289501925395" className="text-accent font-semibold hover:underline">Hubungi kami</a> untuk diskusi lebih lanjut.
        </motion.p>
      </div>
    </section>
  );
}
