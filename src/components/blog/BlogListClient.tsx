"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlogCard from "@/components/blog/BlogCard";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { type BlogPost, type ContentBlock } from "@/lib/data/blog";
import { fetchArticles, type Article } from "@/lib/api/blog";

const PER_PAGE = 6;

function articleToPost(a: Article): BlogPost {
  let content: ContentBlock[] = [];
  try {
    content = JSON.parse(a.content);
  } catch {}
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? "",
    category: a.category ?? "Umum",
    date: a.published_at ?? a.created_at,
    readTime: a.read_time,
    featured: a.featured,
    cover_image: a.cover_image ?? undefined,
    content,
  };
}

function buildPages(total: number, current: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

interface Props {
  initialPosts: BlogPost[];
  initialTotal: number;
  initialPage: number;
  initialTotalPages: number;
  categories: string[];
}

export default function BlogListClient({
  initialPosts,
  initialTotal,
  initialPage,
  initialTotalPages,
  categories: initialCategories,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [categories] = useState<string[]>(initialCategories);
  const [page, setPage] = useState(initialPage);
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Skip fetch on initial mount — already have SSR data
    if (page === initialPage && activeCategory === "Semua") return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchArticles({
      category: activeCategory === "Semua" ? undefined : activeCategory,
      page,
      per_page: PER_PAGE,
    })
      .then((data) => {
        if (!cancelled) {
          setPosts(data.items.map(articleToPost));
          setTotalPages(data.pages);
          setTotal(data.total);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
          setError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeCategory, page]);

  function handleCategory(cat: string) {
    setActiveCategory(cat);
    setPage(1);
  }

  function goPage(n: number) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function retry() {
    setError(false);
    setLoading(true);
    fetchArticles({
      category: activeCategory === "Semua" ? undefined : activeCategory,
      page,
      per_page: PER_PAGE,
    })
      .then((data) => {
        setPosts(data.items.map(articleToPost));
        setTotalPages(data.pages);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }

  return (
    <>
      {/* ── Category Filter ──────────────────────────────────────── */}
      <section className="pb-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "border border-brand-dark/10 bg-white/80 text-brand-dark/60 hover:border-accent hover:text-accent"
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
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-24 text-brand-dark/40">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm font-medium">Memuat artikel...</span>
            </div>
          ) : error ? (
            <div className="py-24 text-center">
              <p className="mb-4 font-medium text-brand-dark/55">
                Gagal memuat artikel. Coba lagi.
              </p>
              <button
                onClick={retry}
                className="rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent/90"
              >
                Coba Lagi
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-24 text-center font-medium text-brand-dark/40">
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
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {posts.map((post, i) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                  >
                    <BlogCard post={post} index={i} priority={i < 3} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* ── Pagination ───────────────────────────────────────────── */}
          {!loading && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-1.5">
              <button
                onClick={() => goPage(page - 1)}
                disabled={page === 1}
                className="border-brand-dark/12 flex h-9 w-9 items-center justify-center rounded-xl border text-brand-dark/50 transition-all duration-200 hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft size={15} />
              </button>

              {buildPages(totalPages, page).map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-9 text-center text-sm font-medium text-brand-dark/30"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goPage(p as number)}
                    className={`h-9 w-9 rounded-xl text-sm font-bold transition-all duration-200 ${
                      page === p
                        ? "bg-accent text-white shadow-md shadow-accent/25"
                        : "border-brand-dark/12 border text-brand-dark/55 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => goPage(page + 1)}
                disabled={page === totalPages}
                className="border-brand-dark/12 flex h-9 w-9 items-center justify-center rounded-xl border text-brand-dark/50 transition-all duration-200 hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}

          {!loading && total > 0 && totalPages > 1 && (
            <p className="mt-4 text-center text-xs font-medium text-brand-dark/35">
              Menampilkan {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} dari{" "}
              {total} artikel
            </p>
          )}
        </div>
      </section>
    </>
  );
}
