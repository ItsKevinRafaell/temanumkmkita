import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogCard from "@/components/blog/BlogCard";
import { type BlogPost, type ContentBlock } from "@/lib/data/blog";
import { type Article } from "@/lib/api/blog";
import { SITE_URL } from "@/lib/seo/site";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.temanumkmkita.com";

export const revalidate = 300;

const PER_PAGE = 12;

const TOPIC_SLUGS = [
  "website",
  "seo-google-maps",
  "sosial-media",
  "branding",
  "maintenance",
  "tips-bisnis",
] as const;

function topicLabel(slug: string): string {
  const map: Record<string, string> = {
    website: "Website",
    "seo-google-maps": "SEO & Google Maps",
    "sosial-media": "Sosial Media",
    branding: "Branding",
    maintenance: "Maintenance",
    "tips-bisnis": "Tips Bisnis",
  };
  return map[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

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

export async function generateStaticParams() {
  return TOPIC_SLUGS.map((s) => ({ slug: s }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = topicLabel(slug);
  const url = `${SITE_URL}/blog/topik/${slug}`;
  return {
    title: `Topik ${label} — Panduan Lengkap | Teman UMKM Kita`,
    description: `Semua panduan seputar ${label} untuk UMKM Indonesia. Dari dasar sampai strategi lanjut, tersusun rapi per topik.`,
    alternates: { canonical: url },
    openGraph: {
      title: `Topik ${label} — Panduan Lengkap`,
      description: `Panduan ${label} untuk UMKM Indonesia.`,
      url,
      type: "website",
    },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const label = topicLabel(slug);

  let posts: BlogPost[] = [];
  try {
    const res = await fetch(
      `${API_BASE}/api/articles?category=${encodeURIComponent(label)}&per_page=${PER_PAGE}`,
      {
        next: { revalidate: 300 },
      }
    );
    if (res.ok) {
      const data = await res.json();
      posts = (data.items as Article[]).map(articleToPost);
    }
  } catch {}

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Topik ${label}`,
    url: `${SITE_URL}/blog/topik/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/blog/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="pt-20">
        <section className="relative overflow-hidden pb-10 pt-12">
          <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-1.5 text-xs font-medium text-brand-dark/40">
              <Link href="/" className="transition-colors hover:text-brand-dark">
                Beranda
              </Link>
              <ChevronRight size={12} />
              <Link href="/blog" className="transition-colors hover:text-brand-dark">
                Artikel
              </Link>
              <ChevronRight size={12} />
              <span className="text-brand-dark/70">{label}</span>
            </div>
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">Topik</p>
              <h1 className="mb-5 text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl lg:text-6xl">
                Semua Tentang {label}
              </h1>
              <p className="text-lg leading-relaxed text-brand-dark/60">
                Pusat panduan {label} untuk UMKM. Dari langkah dasar sampai strategi yang bikin
                bisnis kamu lebih terlihat dan dipercaya.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="py-20 text-center font-medium text-brand-dark/40">
                Belum ada artikel di topik ini.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <BlogCard key={post.slug} post={post} index={i} priority={i < 3} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
