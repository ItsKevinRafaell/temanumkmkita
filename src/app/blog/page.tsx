"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogCard from "@/components/blog/BlogCard";
import BlobDecoration from "@/components/ui/BlobDecoration";
import { ChevronRight, BookOpen } from "lucide-react";
import { categories, getPostsByCategory, type Category } from "@/lib/data/blog";

const INITIAL_VISIBLE = 6;

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Semua");
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const filtered = getPostsByCategory(activeCategory);
  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  function handleCategory(cat: Category) {
    setActiveCategory(cat);
    setVisible(INITIAL_VISIBLE);
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">

        {/* ── Header ────────────────────────────────────────────────── */}
        <section className="relative pt-12 pb-10">
          <BlobDecoration position="top-right" size={340} opacity={0.14} shape={1} />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {shown.map((post, i) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <BlogCard post={post} index={i} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisible((v) => v + 6)}
                  className="px-8 py-3.5 border border-brand-dark/15 text-brand-dark/70 font-semibold rounded-full text-sm hover:border-accent hover:text-accent transition-all duration-200"
                >
                  Muat lebih banyak ({filtered.length - visible} artikel)
                </button>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
