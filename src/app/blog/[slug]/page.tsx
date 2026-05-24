import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlobDecoration from "@/components/ui/BlobDecoration";
import BlogDetailClient from "@/components/blog/BlogDetailClient";
import BlogCard from "@/components/blog/BlogCard";
import { allPosts, getPostBySlug, getRelatedPosts, extractHeadings } from "@/lib/data/blog";
import { Calendar, Clock, ChevronRight, Tag } from "lucide-react";

const SITE_URL = "https://temanumkmkita.com";

const categoryColors: Record<string, string> = {
  Website: "bg-blue-50 text-blue-700 border-blue-100",
  SEO: "bg-green-50 text-green-700 border-green-100",
  "Sosial Media": "bg-pink-50 text-pink-700 border-pink-100",
  Branding: "bg-purple-50 text-purple-700 border-purple-100",
  "Tips Bisnis": "bg-amber-50 text-amber-700 border-amber-100",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: `${post.title} | Blog Teman UMKM Kita`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      tags: [post.category],
    },
    alternates: { canonical: url },
  };
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post, 3);
  const headings = extractHeadings(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        author: { "@type": "Organization", name: "Teman UMKM Kita" },
        publisher: {
          "@type": "Organization",
          name: "Teman UMKM Kita",
          url: SITE_URL,
        },
        url: `${SITE_URL}/blog/${post.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
        ],
      },
    ],
  };

  const colorClass = categoryColors[post.category] ?? "bg-brand-dark/5 text-brand-dark/60 border-brand-dark/10";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="pt-20">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <section className="relative pt-12 pb-8">
          <BlobDecoration position="top-right" size={300} opacity={0.12} shape={1} />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-brand-dark/40 font-medium mb-6 flex-wrap">
              <Link href="/" className="hover:text-brand-dark transition-colors">Beranda</Link>
              <ChevronRight size={12} />
              <Link href="/blog" className="hover:text-brand-dark transition-colors">Blog</Link>
              <ChevronRight size={12} />
              <span className="text-brand-dark/70 line-clamp-1">{post.title}</span>
            </div>

            {/* Meta */}
            <div className="max-w-3xl">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border mb-4 ${colorClass}`}>
                <Tag size={10} />
                {post.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark leading-tight mb-4">
                {post.title}
              </h1>
              <p className="text-brand-dark/60 text-lg leading-relaxed mb-5">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-brand-dark/45 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {formatDate(post.date)}
                </span>
                <span className="w-1 h-1 rounded-full bg-brand-dark/20" />
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {post.readTime} menit baca
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────────────────────── */}
        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlogDetailClient post={post} related={related} headings={headings} />
          </div>
        </section>

        {/* ── Related posts — desktop (below article, outside sidebar) ── */}
        {related.length > 0 && (
          <section className="hidden lg:block pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="border-t border-brand-dark/8 pt-12">
                <h3 className="text-2xl font-extrabold text-brand-dark mb-8">Artikel Terkait</h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  {related.map((p) => <BlogCard key={p.slug} post={p} />)}
                </div>
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
