"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";

function MagneticButton() {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  function handleMouse(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    x.set(cx * 0.3);
    y.set(cy * 0.3);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href="https://wa.me/6289501925395?text=Halo%2C+saya+ingin+konsultasi+gratis"
      target="_blank"
      rel="noopener noreferrer"
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block bg-accent text-brand-dark font-bold text-xl px-10 py-5 rounded-full shadow-2xl shadow-accent/40 cursor-pointer"
    >
      Mulai Sekarang, Gratis →
    </motion.a>
  );
}

export default function CTASection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-canvas overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider">Tunggu Apa Lagi?</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark mt-3 mb-6 leading-tight">
            Waktunya bisnismu<br />
            <span className="text-accent">ditemukan dunia</span>
          </h2>
          <p className="text-brand-dark/60 text-xl mb-10 max-w-2xl mx-auto">
            Konsultasi gratis, tanpa tekanan, tanpa syarat. Ceritakan bisnismu dan kami bantu temukan solusinya.
          </p>

          <MagneticButton />

          <p className="mt-6 text-brand-dark/40 text-sm">
            WhatsApp langsung · Respons cepat · Konsultasi gratis
          </p>
        </motion.div>
      </div>
    </section>
  );
}
