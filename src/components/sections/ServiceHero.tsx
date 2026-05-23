"use client";

import { motion } from "framer-motion";
import type { ServiceData } from "@/lib/data/services";

interface Props {
  service: ServiceData;
}

export default function ServiceHero({ service }: Props) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-canvas pt-20 pb-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-accent/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl mb-6"
        >
          {service.icon}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-1.5 rounded-full mb-6"
        >
          <span className="text-sm font-semibold text-brand-dark">Layanan</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark mb-6 leading-tight"
        >
          {service.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl text-brand-dark/60 mb-4 max-w-2xl mx-auto leading-relaxed"
        >
          {service.hook}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-brand-dark/50 max-w-2xl mx-auto leading-relaxed"
        >
          {service.empathy}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8"
        >
          <a
            href={`https://wa.me/6289501925395?text=Halo%2C+saya+tertarik+dengan+layanan+${encodeURIComponent(service.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-brand-dark font-bold px-8 py-4 rounded-full text-lg hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-lg shadow-accent/30 inline-block"
          >
            Konsultasi Gratis →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
