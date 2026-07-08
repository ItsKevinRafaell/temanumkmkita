import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogListClient from "@/components/blog/BlogListClient";
import { type BlogPost, type ContentBlock } from "@/lib/data/blog";
import { fetchArticles, fetchPublicCategories, type Article } from "@/lib/api/blog";

export const revalidate = 60;

const PER_PAGE = 6;

function articleToPost(a: Article): BlogPost {
  let content: ContentBlock[] = [];
  try { content = JSON.parse(a.content); } catch {}
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

export default async function BlogPage() {
  let initialPosts: BlogPost[] = [];
  let initialTotal = 0;
  let initialTotalPages = 1;
  let categories: string[] = ["Semua"];

  try {
    const [data, cats] = await Promise.all([
      fetchArticles({ per_page: PER_PAGE, page: 1 }),
      fetchPublicCategories().catch(() => []),
    ]);
    initialPosts = data.items.map(articleToPost);
    initialTotal = data.total;
    initialTotalPages = data.pages;
    categories = ["Semua", ...cats.map((c) => c.name)];
  } catch (err) {
    // Fallback to empty state — client component handles retry
    console.error("SSR blog fetch failed:", err);
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">

        {/* ── Header ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-12 pb-10">
          <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-brand-dark/40 font-medium mb-8">
              <Link href="/" className="hover:text-brand-dark transition-colors">Beranda</Link>
              <ChevronRight size={12} />
              <span className="text-brand-dark/70">Artikel</span>
            </div>
            <div className="max-w-2xl">
              <p className="text-accent font-bold text-sm uppercase tracking-wider mb-4">
                Artikel Dan Panduan
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark leading-tight mb-5">
                Tips Dan Panduan Digital Untuk UMKM.
              </h1>
              <p className="text-brand-dark/60 text-lg leading-relaxed">
                Strategi praktis yang bisa langsung diterapkan — tanpa jargon teknis yang membingungkan.
              </p>
            </div>
          </div>
        </section>

        <BlogListClient
          initialPosts={initialPosts}
          initialTotal={initialTotal}
          initialPage={1}
          initialTotalPages={initialTotalPages}
          categories={categories}
        />

      </main>
      <Footer />
    </>
  );
}