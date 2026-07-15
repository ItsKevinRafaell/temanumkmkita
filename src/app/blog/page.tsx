import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogListClient from "@/components/blog/BlogListClient";
import { type BlogPost, type ContentBlock } from "@/lib/data/blog";
import { fetchArticles, fetchPublicCategories, type Article } from "@/lib/api/blog";

export const revalidate = 300;

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
        <section className="relative overflow-hidden pb-10 pt-12">
          <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-1.5 text-xs font-medium text-brand-dark/40">
              <Link href="/" className="transition-colors hover:text-brand-dark">
                Beranda
              </Link>
              <ChevronRight size={12} />
              <span className="text-brand-dark/70">Artikel</span>
            </div>
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">
                Artikel Dan Panduan
              </p>
              <h1 className="mb-5 text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl lg:text-6xl">
                Tips Dan Panduan Digital Untuk UMKM.
              </h1>
              <p className="text-lg leading-relaxed text-brand-dark/60">
                Strategi praktis yang bisa langsung diterapkan — tanpa jargon teknis yang
                membingungkan.
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
