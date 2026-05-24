"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogCard from "@/components/blog/BlogCard";
import BlobDecoration from "@/components/ui/BlobDecoration";
import { ChevronRight, ChevronLeft, BookOpen } from "lucide-react";
import { categories, getPostsByCategory, type Category } from "@/lib/data/blog";

const PER_PAGE = 6;

function buildPages(total: number, current: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Semua");
  const [page, setPage] = useState(1);

  const filtered = getPostsByCategory(activeCategory);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleCategory(cat: Category) {
    setActiveCategory(cat);
    setPage(1);
  }

  function goPage(n: number) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">

        {/* ── Header ────────────────────────────────────────────────── */}
        <section className="relative pt-12 pb-10">
          <BlobDecoration position="top-right" size={340} opacity={0.14} shape={1} />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-brand-dark/40 font-medium mb-6">
              <Link href="/" className="hover:text-brand-dark transition-colors">Beranda</Link>
              <ChevronRight size={12} />
              <span className="text-brand-dark/70">Blog</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-1.5 rounded-full mb-5">
                <BookOpen size={13} className="text-accent" />
                <span className="text-sm font-semibold text-brand-dark">Blog</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight mb-4">
                Tips & Panduan Digital<br />
                <span className="text-accent">untuk UMKM.</span>
              </h1>
              <p className="text-brand-dark/60 text-lg">
                Strategi praktis yang bisa langsung diterapkan — tanpa jargon teknis yang membingungkan.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Category Filter ───────────────────────────────────────── */}
        <section className="pb-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-accent text-white shadow-md shadow-accent/20"
                      : "bg-white/80 border border-brand-dark/10 text-brand-dark/60 hover:border-accent hover:text-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Post Grid ─────────────────────────────────────────────── */}
        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {shown.length === 0 ? (
              <div className="py-24 text-center text-brand-dark/40 font-medium">
                Belum ada artikel di kategori ini.
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${page}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {shown.map((post, i) => (
                    <motion.div
                      key={post.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.35 }}
                    >
                      <BlogCard post={post} index={i} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* ── Pagination ──────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-12">
                {/* Prev */}
                <button
                  onClick={() => goPage(page - 1)}
                  disabled={page === 1}
                  className="flex items-center justify-center w-9 h-9 rounded-xl border border-brand-dark/12 text-brand-dark/50 hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft size={15} />
                </button>

                {buildPages(totalPages, page).map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="w-9 text-center text-sm text-brand-dark/30 font-medium">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goPage(p as number)}
                      className={`w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200 ${
                        page === p
                          ? "bg-accent text-white shadow-md shadow-accent/25"
                          : "border border-brand-dark/12 text-brand-dark/55 hover:border-accent hover:text-accent"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => goPage(page + 1)}
                  disabled={page === totalPages}
                  className="flex items-center justify-center w-9 h-9 rounded-xl border border-brand-dark/12 text-brand-dark/50 hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            )}

            {/* Post count info */}
            {filtered.length > 0 && totalPages > 1 && (
              <p className="text-center text-xs text-brand-dark/35 font-medium mt-4">
                Menampilkan {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} dari {filtered.length} artikel
              </p>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
