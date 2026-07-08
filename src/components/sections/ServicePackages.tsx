"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check } from "lucide-react";
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
            Pilih Yang Sesuai Bisnismu
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className={cn(pkg.highlighted ? "md:scale-105" : "")}
            >
              {pkg.highlighted ? (
                <div className="relative rounded-lg border-2 border-accent bg-white p-6 md:p-8 h-full shadow-card">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1 rounded-md">
                      Paling Populer
                    </div>

                    <div className="font-bold text-base md:text-lg mb-1 text-brand-dark">{pkg.name}</div>
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <div className="text-2xl md:text-3xl font-extrabold text-accent">{pkg.price}</div>
                      {pkg.period && (
                        <div className="text-xs md:text-sm text-brand-dark/50">{pkg.period}</div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 mt-6">
                      {pkg.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <Check size={15} className="text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-brand-dark/70">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="https://wa.me/6289501925395?text=Halo%2C+saya+tertarik+dengan+paket"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center font-bold py-3 rounded-lg transition-colors bg-accent text-white hover:bg-accent/90"
                    >
                      Pilih Paket Ini
                    </a>
                </div>
              ) : (
                <div className="rounded-lg p-6 md:p-8 relative bg-white border border-brand-dark/10 card-shadow hover:card-shadow-hover hover:-translate-y-0.5 transition-all duration-300">
                  <div className="font-bold text-base md:text-lg mb-1 text-brand-dark">{pkg.name}</div>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <div className="text-2xl md:text-3xl font-extrabold text-brand-dark">{pkg.price}</div>
                    {pkg.period && (
                      <div className="text-xs md:text-sm text-brand-dark/50">{pkg.period}</div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 mt-6">
                    {pkg.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check size={15} className="text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-brand-dark/70">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="https://wa.me/6289501925395?text=Halo%2C+saya+tertarik+dengan+paket"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center font-bold py-3 rounded-lg transition-colors border border-brand-dark/20 text-brand-dark hover:border-brand-dark/40"
                  >
                    Pilih Paket Ini
                  </a>
                </div>
              )}
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
