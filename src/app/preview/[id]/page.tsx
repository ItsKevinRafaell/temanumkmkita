"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { adminGetArticle, type AdminArticle } from "@/lib/api/admin";
import { extractHeadings, type BlogPost, type ContentBlock } from "@/lib/data/blog";
import BlogDetailClient from "@/components/blog/BlogDetailClient";
import { Calendar, Clock, Tag, ChevronLeft } from "lucide-react";

function articleToPost(a: AdminArticle): BlogPost {
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
    content,
  };
}

const categoryColors: Record<string, string> = {
  Website: "bg-blue-50 text-blue-700 border-blue-100",
  "SEO & Google Maps": "bg-green-50 text-green-700 border-green-100",
  SEO: "bg-green-50 text-green-700 border-green-100",
  "Sosial Media": "bg-pink-50 text-pink-700 border-pink-100",
  Branding: "bg-purple-50 text-purple-700 border-purple-100",
  Maintenance: "bg-cyan-50 text-cyan-700 border-cyan-100",
  "Tips Bisnis": "bg-amber-50 text-amber-700 border-amber-100",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<AdminArticle | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminGetArticle(id)
      .then(setArticle)
      .catch(() => setError("Artikel tidak ditemukan atau sesi sudah habis."));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/admin/posts" className="text-xs text-brand-dark/50 hover:text-brand-dark transition">
          ← Kembali ke admin
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[#242423]/40">
        Memuat...
      </div>
    );
  }

  const post = articleToPost(article);
  const headings = extractHeadings(post.content);
  const colorClass = categoryColors[post.category] ?? "bg-gray-50 text-gray-600 border-gray-100";

  return (
    <>
      {/* Preview banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 text-sm text-amber-800 font-semibold">
          <span className="inline-flex items-center gap-1.5 bg-amber-200/60 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Mode Preview
          </span>
          {article.status === "draft" && (
            <span className="text-xs text-amber-700/70 font-normal">— artikel ini masih draft, belum tayang</span>
          )}
        </div>
        <Link
          href={`/admin/posts/${id}`}
          className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold hover:text-amber-900 transition"
        >
          <ChevronLeft size={13} /> Kembali ke Editor
        </Link>
      </div>

      <main className="pt-8">
        {/* Header */}
        <section className="relative pt-8 pb-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border mb-4 ${colorClass}`}>
                <Tag size={10} />
                {post.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242423] leading-tight mb-4">
                {post.title}
              </h1>
              <p className="text-[#242423]/60 text-lg leading-relaxed mb-5">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-[#242423]/45 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {formatDate(post.date)}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#242423]/20" />
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {post.readTime} menit baca
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlogDetailClient post={post} related={[]} headings={headings} />
          </div>
        </section>
      </main>
    </>
  );
}
