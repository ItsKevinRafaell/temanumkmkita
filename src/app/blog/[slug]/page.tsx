import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlobDecoration from "@/components/ui/BlobDecoration";
import BlogDetailClient from "@/components/blog/BlogDetailClient";
import BlogCard from "@/components/blog/BlogCard";
import { extractHeadings, hasBlockType, type BlogPost, type ContentBlock } from "@/lib/data/blog";
import { fetchArticleBySlug, fetchArticles, type Article } from "@/lib/api/blog";
import { Calendar, Clock, ChevronRight, Tag, UserCircle, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

const SITE_URL = "https://temanumkmkita.com";

const categoryColors: Record<string, string> = {
  Website: "bg-blue-50 text-blue-700 border-blue-100",
  SEO: "bg-green-50 text-green-700 border-green-100",
  "Sosial Media": "bg-pink-50 text-pink-700 border-pink-100",
  Branding: "bg-purple-50 text-purple-700 border-brand-100",
  "Tips Bisnis": "bg-amber-50 text-amber-700 border-amber-100",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function articleToPost(a: Article): BlogPost {
  let content: ContentBlock[] = [];
  try { content = JSON.parse(a.content); } catch {}
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
    const metaDesc = article.meta_description ?? article.excerpt ?? undefined;
    const ogImages = article.cover_image
      ? [{ url: article.cover_image, width: 1200, height: 630 }]
      : undefined;
    return {
      title: metaTitle,
      description: metaDesc,
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

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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

  const authorSchema = post.author ? {
    "@type": "Person",
    name: post.author.name,
    url: `${SITE_URL}/blog/author/${post.author.slug}`,
    ...(post.author.linkedin_url ? { sameAs: [post.author.linkedin_url] } : {}),
    ...(post.author.role ? { jobTitle: post.author.role } : {}),
  } : { "@type": "Organization", name: "Teman UMKM Kita" };

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
        { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
      ],
    },
  ];

  if (post.author) {
    jsonLdGraph.push(authorSchema);
  }

  if (hasBlockType(post.content, "faq")) {    const faqBlocks = post.content.filter((b) => b.type === "faq") as Extract<ContentBlock, { type: "faq" }>[];
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
    const howtoBlocks = post.content.filter((b) => b.type === "howto") as Extract<ContentBlock, { type: "howto" }>[];
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
            <div className="flex items-center gap-1.5 text-xs text-brand-dark/40 font-medium mb-6 flex-wrap">
              <Link href="/" className="hover:text-brand-dark transition-colors">Beranda</Link>
              <ChevronRight size={12} />
              <Link href="/blog" className="hover:text-brand-dark transition-colors">Artikel</Link>
              <ChevronRight size={12} />
              <span className="text-brand-dark/70 line-clamp-1">{post.title}</span>
            </div>

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
                {post.updatedAt && post.updatedAt !== post.date && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-brand-dark/20" />
                    <span className="text-xs text-brand-dark/35">Diperbarui {formatDate(post.updatedAt)}</span>
                  </>
                )}
              </div>

              {/* Author byline */}
              {post.author && (
                <div className="flex items-center gap-2.5 mt-4">
                  {post.author.photo_url ? (
                    <img src={post.author.photo_url} alt={post.author.name} className="w-9 h-9 rounded-full object-cover border border-brand-dark/8 flex-shrink-0" />
                  ) : (
                    <UserCircle size={36} className="text-brand-dark/25 flex-shrink-0" />
                  )}
                  <div>
                    <Link href={`/blog/author/${post.author.slug}`} className="text-sm font-bold text-brand-dark hover:text-accent transition-colors">
                      {post.author.name}
                    </Link>
                    {post.author.role && <p className="text-xs text-brand-dark/45">{post.author.role}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────────────────────── */}
        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlogDetailClient post={post} related={related} headings={headings} />
          </div>
        </section>

        {/* ── About Author ──────────────────────────────────────────── */}
        {post.author && (
          <section className="pb-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="border border-brand-dark/8 rounded-2xl p-6 flex items-start gap-5">
                {post.author.photo_url ? (
                  <img src={post.author.photo_url} alt={post.author.name} className="w-14 h-14 rounded-full object-cover border border-brand-dark/8 flex-shrink-0" loading="lazy" />
                ) : (
                  <UserCircle size={56} className="text-brand-dark/20 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-dark/35 mb-1">Tentang Penulis</p>
                  <Link href={`/blog/author/${post.author.slug}`} className="text-base font-extrabold text-brand-dark hover:text-accent transition-colors">
                    {post.author.name}
                  </Link>
                  {post.author.role && <p className="text-sm text-brand-dark/50 mt-0.5">{post.author.role}</p>}
                  {post.author.bio && <p className="text-sm text-brand-dark/65 mt-2 leading-relaxed max-w-lg">{post.author.bio}</p>}
                  {post.author.linkedin_url && (
                    <a href={post.author.linkedin_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-brand-dark/40 hover:text-accent transition-colors">
                      <ExternalLink size={11} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Related posts ─────────────────────────────────────────── */}
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
