"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-x-0 top-16 h-px bg-brand-dark/10" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-accent font-bold text-sm uppercase tracking-wider mb-5">
              Halaman Tidak Ditemukan
            </p>

            <div className="text-[160px] sm:text-[200px] font-extrabold text-brand-dark/6 leading-none select-none">
              404
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mt-2 mb-4">
              Waduh, Salah Jalan!
            </h1>
            <p className="text-brand-dark/60 text-lg mb-10 max-w-md mx-auto">
              Halaman yang kamu cari tidak ada atau sudah dipindahkan. Yuk balik ke jalur yang benar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="bg-accent text-white font-bold px-6 py-3.5 rounded-lg text-base hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
              >
                Kembali ke Beranda
              </Link>
              <Link
                href="/layanan/web-development"
                className="text-brand-dark font-semibold px-6 py-3.5 rounded-lg border border-brand-dark/20 hover:border-brand-dark/40 transition-colors"
              >
                Lihat Layanan
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
