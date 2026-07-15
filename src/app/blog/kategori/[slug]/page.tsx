import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogCard from "@/components/blog/BlogCard";
import { type BlogPost, type ContentBlock } from "@/lib/data/blog";
import { fetchArticles, fetchPublicCategories, type Article } from "@/lib/api/blog";
import { SITE_URL } from "@/lib/seo/site";

export const revalidate = 300;

const PER_PAGE = 12;

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

function labelFromSlug(slug: string): string {
  const map: Record<string, string> = {
    website: "Website",
    "seo-google-maps": "SEO & Google Maps",
    seo: "SEO",
    "sosial-media": "Sosial Media",
    branding: "Branding",
    maintenance: "Maintenance",
    "tips-bisnis": "Tips Bisnis",
  };
  return map[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateStaticParams() {
  try {
    const cats = await fetchPublicCategories();
    return cats.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = labelFromSlug(slug);
  const url = `${SITE_URL}/blog/kategori/${slug}`;
  return {
    title: `Artikel ${label} — Blog Teman UMKM Kita`,
    description: `Kumpulan artikel dan panduan seputar ${label} untuk UMKM Indonesia. Tips praktis yang bisa langsung diterapkan.`,
    alternates: { canonical: url },
    openGraph: {
      title: `Artikel ${label} — Blog Teman UMKM Kita`,
      description: `Tips dan panduan ${label} untuk UMKM Indonesia.`,
      url,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const label = labelFromSlug(slug);

  let posts: BlogPost[] = [];
  try {
    const data = await fetchArticles({ category: label, per_page: PER_PAGE, page: 1 });
    posts = data.items.map(articleToPost);
  } catch {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Artikel ${label}`,
    url: `${SITE_URL}/blog/kategori/${slug}`,
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
        <section className="relative overflow-hidden pt-12 pb-10">
          <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-brand-dark/40 font-medium mb-8">
              <Link href="/" className="hover:text-brand-dark transition-colors">Beranda</Link>
              <ChevronRight size={12} />
              <Link href="/blog" className="hover:text-brand-dark transition-colors">Artikel</Link>
              <ChevronRight size={12} />
              <span className="text-brand-dark/70">{label}</span>
            </div>
            <div className="max-w-2xl">
              <p className="text-accent font-bold text-sm uppercase tracking-wider mb-4">
                Kategori
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark leading-tight mb-5">
                Artikel Tentang {label}
              </h1>
              <p className="text-brand-dark/60 text-lg leading-relaxed">
                Kumpulan panduan dan tips {label} untuk membantu bisnis kamu
                lebih terlihat, dipercaya, dan tumbuh.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="py-20 text-center text-brand-dark/40 font-medium">
                Belum ada artikel di kategori ini.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
