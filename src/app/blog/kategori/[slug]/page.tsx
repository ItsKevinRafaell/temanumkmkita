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
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title: `Artikel ${label} — Blog Teman UMKM Kita`,
      description: `Tips dan panduan ${label} untuk UMKM Indonesia.`,
      url,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
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
              <p className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">
                Kategori
              </p>
              <h1 className="mb-5 text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl lg:text-6xl">
                Artikel Tentang {label}
              </h1>
              <p className="text-lg leading-relaxed text-brand-dark/60">
                Kumpulan panduan dan tips {label} untuk membantu bisnis kamu lebih terlihat,
                dipercaya, dan tumbuh.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="py-20 text-center font-medium text-brand-dark/40">
                Belum ada artikel di kategori ini.
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
