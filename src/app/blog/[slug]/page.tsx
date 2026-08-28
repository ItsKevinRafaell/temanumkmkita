import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogDetailClient from "@/components/blog/BlogDetailClient";
import BlogCard from "@/components/blog/BlogCard";
import { extractHeadings, hasBlockType, type BlogPost, type ContentBlock } from "@/lib/data/blog";
import { fetchArticleBySlug, fetchArticles, type Article } from "@/lib/api/blog";
import { SITE_URL, extractFirstParagraph } from "@/lib/seo/site";
import {
  Calendar,
  Clock,
  ChevronRight,
  Tag,
  UserCircle,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

export const revalidate = 300;

const categoryColors: Record<string, string> = {
  Website: "bg-blue-50 text-blue-700 border-blue-100",
  "SEO & Google Maps": "bg-green-50 text-green-700 border-green-100",
  SEO: "bg-green-50 text-green-700 border-green-100",
  "Sosial Media": "bg-pink-50 text-pink-700 border-pink-100",
  Branding: "bg-purple-50 text-purple-700 border-purple-100",
  Maintenance: "bg-cyan-50 text-cyan-700 border-cyan-100",
  "Tips Bisnis": "bg-amber-50 text-amber-700 border-amber-100",
};

const CATEGORY_SERVICE_MAP: Record<
  string,
  { slug: string; title: string; desc: string; icon: string }[]
> = {
  Website: [
    { slug: "web-development", title: "Web Development", desc: "Website profesional untuk bisnismu.", icon: "🌐" },
    { slug: "web-development-bulanan", title: "Web Dev Bulanan", desc: "Mulai dari Rp 120.000/bulan.", icon: "📅" },
  ],
  SEO: [
    { slug: "seo-google-maps", title: "SEO & Google Maps", desc: "Bisnismu di halaman pertama Google.", icon: "📍" },
  ],
  "SEO & Google Maps": [
    { slug: "seo-google-maps", title: "SEO & Google Maps", desc: "Bisnismu di halaman pertama Google.", icon: "📍" },
  ],
  "Sosial Media": [
    { slug: "kelola-sosial-media", title: "Kelola Sosial Media", desc: "Konten rutin tanpa ribet.", icon: "📲" },
  ],
  Branding: [
    { slug: "desain-logo", title: "Desain Logo", desc: "Identitas visual yang berkesan.", icon: "✏️" },
  ],
  Maintenance: [
    { slug: "maintenance", title: "Maintenance Website", desc: "Website aman dan selalu update.", icon: "🔧" },
  ],
  "Tips Bisnis": [
    { slug: "web-development", title: "Web Development", desc: "Website profesional untuk bisnismu.", icon: "🌐" },
    { slug: "seo-google-maps", title: "SEO & Google Maps", desc: "Bisnismu di halaman pertama Google.", icon: "📍" },
  ],
};

function LayananTerkait({ category }: { category: string }) {
  const services = CATEGORY_SERVICE_MAP[category];
  if (!services || services.length === 0) return null;

  return (
    <section className="not-prose pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-accent/25 bg-accent/5 p-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-accent">
            Layanan Terkait
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((svc) => (
              <Link
                key={svc.slug}
                href={`/layanan/${svc.slug}`}
                className="group flex items-center gap-3 rounded-lg border border-brand-dark/8 bg-white p-4 transition-all hover:border-accent/40 hover:shadow-md"
              >
                <span className="text-2xl">{svc.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-brand-dark group-hover:text-accent transition-colors">
                    {svc.title}
                  </p>
                  <p className="text-xs text-brand-dark/50">{svc.desc}</p>
                </div>
                <ArrowRight
                  size={14}
                  className="flex-shrink-0 text-brand-dark/25 transition-all group-hover:text-accent group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
    updatedAt: a.updated_at ?? undefined,
    readTime: a.read_time,
    featured: a.featured,
    cover_image: a.cover_image ?? undefined,
    content,
    author: a.author ?? undefined,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const article = await fetchArticleBySlug(slug);
    const url = `${SITE_URL}/blog/${article.slug}`;
    const metaTitle = article.seo_title ?? `${article.title} | Blog Teman UMKM Kita`;
    const metaDesc =
      article.meta_description ?? article.excerpt ?? extractFirstParagraph(article.content);
    const ogImages = article.cover_image
      ? [{ url: article.cover_image, width: 1200, height: 630 }]
      : undefined;
    return {
      title: metaTitle,
      description: metaDesc,
      robots: { index: true, follow: true },
      openGraph: {
        title: article.seo_title ?? article.title,
        description: metaDesc,
        url,
        type: "article",
        publishedTime: article.published_at ?? undefined,
        modifiedTime: article.updated_at ?? article.published_at ?? undefined,
        tags: article.category ? [article.category] : [],
        images: ogImages,
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDesc,
        images: ogImages ? [ogImages[0].url] : undefined,
      },
      alternates: { canonical: url },
    };
  } catch {
    return {};
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let article: Article;
  try {
    article = await fetchArticleBySlug(slug);
  } catch (err) {
    if (err instanceof Error && err.message === "Article not found") {
      notFound();
    }
    throw err;
  }

  const post = articleToPost(article);
  const headings = extractHeadings(post.content);

  // Related posts — same category, exclude current
  let related: BlogPost[] = [];
  try {
    const relData = await fetchArticles({ category: post.category, per_page: 4 });
    related = relData.items
      .filter((a) => a.slug !== slug)
      .slice(0, 3)
      .map(articleToPost);
  } catch {}

  const authorSchema = post.author
    ? {
        "@type": "Person",
        name: post.author.name,
        url: `${SITE_URL}/blog/author/${post.author.slug}`,
        ...(post.author.linkedin_url ? { sameAs: [post.author.linkedin_url] } : {}),
        ...(post.author.role ? { jobTitle: post.author.role } : {}),
      }
    : { "@type": "Organization", name: "Teman UMKM Kita" };

  const jsonLdGraph: object[] = [
    {
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: article.updated_at ?? post.date,
      ...(post.cover_image ? { image: post.cover_image } : {}),
      author: authorSchema,
      publisher: { "@type": "Organization", name: "Teman UMKM Kita", url: SITE_URL },
      url: `${SITE_URL}/blog/${post.slug}`,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Artikel", item: `${SITE_URL}/blog` },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: `${SITE_URL}/blog/${post.slug}`,
        },
      ],
    },
  ];

  if (post.author) {
    jsonLdGraph.push(authorSchema);
  }

  if (hasBlockType(post.content, "faq")) {
    const faqBlocks = post.content.filter((b) => b.type === "faq") as Extract<
      ContentBlock,
      { type: "faq" }
    >[];
    const mainEntity = faqBlocks.flatMap((b) =>
      b.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      }))
    );
    jsonLdGraph.push({ "@type": "FAQPage", mainEntity });
  }

  if (hasBlockType(post.content, "howto")) {
    const howtoBlocks = post.content.filter((b) => b.type === "howto") as Extract<
      ContentBlock,
      { type: "howto" }
    >[];
    for (const hb of howtoBlocks) {
      jsonLdGraph.push({
        "@type": "HowTo",
        name: post.title,
        step: hb.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
          ...(s.image ? { image: s.image } : {}),
        })),
      });
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": jsonLdGraph,
  };

  const colorClass =
    categoryColors[post.category] ?? "bg-brand-dark/5 text-brand-dark/60 border-brand-dark/10";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="pt-20">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pb-8 pt-12">
          <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-wrap items-center gap-1.5 text-xs font-medium text-brand-dark/40">
              <Link href="/" className="transition-colors hover:text-brand-dark">
                Beranda
              </Link>
              <ChevronRight size={12} />
              <Link href="/blog" className="transition-colors hover:text-brand-dark">
                Artikel
              </Link>
              <ChevronRight size={12} />
              <span className="line-clamp-1 text-brand-dark/70">{post.title}</span>
            </div>

            <div className="max-w-3xl">
              <span
                className={`mb-4 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold ${colorClass}`}
              >
                <Tag size={10} />
                {post.category}
              </span>
              <h1 className="mb-4 text-3xl font-extrabold leading-tight text-brand-dark sm:text-4xl">
                {post.title}
              </h1>
              <p className="mb-5 text-lg leading-relaxed text-brand-dark/60">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm font-medium text-brand-dark/45">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {formatDate(post.date)}
                </span>
                <span className="h-1 w-1 rounded-sm bg-brand-dark/20" />
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {post.readTime} menit baca
                </span>
                {post.updatedAt && post.updatedAt !== post.date && (
                  <>
                    <span className="h-1 w-1 rounded-sm bg-brand-dark/20" />
                    <span className="text-xs text-brand-dark/35">
                      Diperbarui {formatDate(post.updatedAt)}
                    </span>
                  </>
                )}
              </div>

              {/* Author byline */}
              {post.author && (
                <div className="mt-4 flex items-center gap-2.5">
                  {post.author.photo_url ? (
                    <Image
                      src={post.author.photo_url}
                      alt={post.author.name}
                      width={36}
                      height={36}
                      className="border-brand-dark/8 flex-shrink-0 rounded-full border object-cover"
                    />
                  ) : (
                    <UserCircle size={36} className="flex-shrink-0 text-brand-dark/25" />
                  )}
                  <div>
                    <Link
                      href={`/blog/author/${post.author.slug}`}
                      className="text-sm font-bold text-brand-dark transition-colors hover:text-accent"
                    >
                      {post.author.name}
                    </Link>
                    {post.author.role && (
                      <p className="text-xs text-brand-dark/45">{post.author.role}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <BlogDetailClient post={post} related={related} headings={headings} />
          </div>
        </section>

        {/* ── About Author ──────────────────────────────────────────── */}
        {post.author && (
          <section className="pb-10">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="border-brand-dark/8 flex items-start gap-5 rounded-lg border p-6">
                {post.author.photo_url ? (
                  <Image
                    src={post.author.photo_url}
                    alt={post.author.name}
                    width={56}
                    height={56}
                    className="border-brand-dark/8 flex-shrink-0 rounded-full border object-cover"
                  />
                ) : (
                  <UserCircle size={56} className="flex-shrink-0 text-brand-dark/20" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-dark/35">
                    Tentang Penulis
                  </p>
                  <Link
                    href={`/blog/author/${post.author.slug}`}
                    className="text-base font-extrabold text-brand-dark transition-colors hover:text-accent"
                  >
                    {post.author.name}
                  </Link>
                  {post.author.role && (
                    <p className="mt-0.5 text-sm text-brand-dark/50">{post.author.role}</p>
                  )}
                  {post.author.bio && (
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-brand-dark/65">
                      {post.author.bio}
                    </p>
                  )}
                  {post.author.linkedin_url && (
                    <a
                      href={post.author.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-dark/40 transition-colors hover:text-accent"
                    >
                      <ExternalLink size={11} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Layanan Terkait (internal links to service pages) ──── */}
        <LayananTerkait category={post.category} />

        {/* ── Related posts ─────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="hidden pb-20 lg:block">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="border-brand-dark/8 border-t pt-12">
                <h3 className="mb-8 text-2xl font-extrabold text-brand-dark">Artikel Terkait</h3>
                <div className="grid gap-6 sm:grid-cols-3">
                  {related.map((p) => (
                    <BlogCard key={p.slug} post={p} />
                  ))}
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
