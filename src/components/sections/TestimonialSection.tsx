"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useAnimationControls } from "framer-motion";
import { useInView } from "react-intersection-observer";

const testimonials = [
  {
    name: "PT Maju Lestari Sejahtera",
    service: "SEO & Google Maps",
    text: "Setelah pakai layanan SEO Teman UMKM Kita, bisnis kami muncul di halaman pertama Google dalam 2 bulan. Pelanggan baru datang dari online, bukan cuma referral lagi.",
    result: "Muncul di halaman 1 Google dalam 2 bulan",
    avatar: "M",
  },
  {
    name: "PT Mitra Harmoni Kencana",
    service: "Maintenance & Web Development",
    text: "Website kami yang lama sudah lambat dan sering bermasalah. Tim Teman UMKM Kita bantu rebuild dari awal dan sekarang maintenance rutin. Tidak perlu pusing teknikal lagi.",
    result: "Website 3x lebih cepat, zero downtime",
    avatar: "H",
  },
];

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useAnimationControls();

  function goTo(index: number) {
    const container = containerRef.current;
    if (!container) return;
    const cardWidth = container.offsetWidth;
    controls.start({ x: -index * cardWidth, transition: { type: "spring", stiffness: 300, damping: 30 } });
    setCurrent(index);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (current + 1) % testimonials.length;
      goTo(next);
    }, 5500);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  function onDragEnd(_: unknown, info: { offset: { x: number } }) {
    const threshold = 60;
    if (info.offset.x < -threshold && current < testimonials.length - 1) {
      goTo(current + 1);
    } else if (info.offset.x > threshold && current > 0) {
      goTo(current - 1);
    } else {
      goTo(current);
    }
  }

  return (
    <section ref={ref} className="py-24 bg-transparent relative">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider">
            Kata Klien Kami
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mt-3">
            Mereka sudah merasakan
            <br />
            <span className="text-accent">hasilnya</span>
          </h2>
        </motion.div>

        {/* Drag slider */}
        <div ref={containerRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
          <motion.div
            drag="x"
            dragConstraints={{ left: -(testimonials.length - 1) * (containerRef.current?.offsetWidth ?? 600), right: 0 }}
            dragElastic={0.1}
            animate={controls}
            style={{ x }}
            onDragEnd={onDragEnd}
            className="flex"
          >
            {testimonials.map((t, i) => (
              <div key={i} className="min-w-full select-none px-1">
                <div className="relative bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-3xl p-8 sm:p-12 overflow-hidden">
                  <span className="absolute top-4 right-6 text-7xl text-brand-dark/5 font-serif leading-none select-none">
                    &rdquo;
                  </span>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent border border-brand-dark/10 rounded-full flex items-center justify-center text-brand-dark font-bold text-lg flex-shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-brand-dark">{t.name}</div>
                      <div className="text-accent text-sm font-medium">{t.service}</div>
                    </div>
                  </div>

                  <blockquote className="text-brand-dark/70 text-lg leading-relaxed mb-6">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>

                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 px-4 py-2 rounded-full">
                      <span className="text-accent text-sm">✓</span>
                      <span className="text-accent text-sm font-semibold">{t.result}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === current ? "bg-accent w-7" : "bg-brand-dark/20 w-2.5"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
