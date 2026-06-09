"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { FAQ } from "@/lib/data/services";

interface Props {
  faqs: FAQ[];
  title: string;
}

export default function ServiceFAQ({ faqs, title }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 bg-canvas">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark mt-3">
            Pertanyaan tentang {title}
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-white rounded-lg border border-brand-dark/8 overflow-hidden"
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-semibold text-brand-dark hover:text-accent transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {faq.question}
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  className="text-accent text-xl flex-shrink-0"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-brand-dark/60 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
