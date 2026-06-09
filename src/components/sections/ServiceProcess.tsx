"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { ProcessStep } from "@/lib/data/services";

interface Props {
  steps: ProcessStep[];
}

export default function ServiceProcess({ steps }: Props) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider">Cara Kerja</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark mt-3">
            Proses Pengerjaan
          </h2>
        </motion.div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="flex gap-5 items-start bg-canvas rounded-lg p-6"
            >
              <div className="w-10 h-10 bg-accent rounded-md flex items-center justify-center text-brand-dark font-extrabold flex-shrink-0">
                {i + 1}
              </div>
              <div>
                <div className="font-bold text-brand-dark text-lg">{step.title}</div>
                <div className="text-brand-dark/60 mt-1">{step.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
