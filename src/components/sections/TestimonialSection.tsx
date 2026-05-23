"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const testimonials = [
  {
    name: "PT Maju Lestari Sejahtera",
    short: "PT MLS",
    service: "SEO & Google Maps",
    text: "Setelah pakai layanan SEO Teman UMKM Kita, bisnis kami muncul di halaman pertama Google dalam 2 bulan. Pelanggan baru datang dari online, bukan cuma referral lagi.",
    result: "Muncul di halaman 1 Google dalam 2 bulan",
    avatar: "M",
    color: "bg-blue-500",
  },
  {
    name: "PT Mitra Harmoni Kencana",
    short: "PT MHK",
    service: "Maintenance & Web Development",
    text: "Website kami yang lama sudah lambat dan sering bermasalah. Tim Teman UMKM Kita bantu rebuild dari awal dan sekarang maintenance rutin. Tidak perlu pusing teknikal lagi.",
    result: "Website 3x lebih cepat, zero downtime",
    avatar: "H",
    color: "bg-green-500",
  },
];

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className="py-24 bg-brand-dark overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider">Kata Klien Kami</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-3">
            Mereka sudah merasakan<br />
            <span className="text-accent">hasilnya</span>
          </h2>
        </motion.div>

        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 ${testimonials[current].color} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {testimonials[current].avatar}
                </div>
                <div>
                  <div className="font-bold text-white">{testimonials[current].name}</div>
                  <div className="text-accent text-sm font-medium">{testimonials[current].service}</div>
                </div>
              </div>

              <blockquote className="text-white/80 text-lg leading-relaxed mb-6">
                &ldquo;{testimonials[current].text}&rdquo;
              </blockquote>

              <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 px-4 py-2 rounded-full">
                <span className="text-accent text-sm">✓</span>
                <span className="text-accent text-sm font-semibold">{testimonials[current].result}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-accent w-6" : "bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
