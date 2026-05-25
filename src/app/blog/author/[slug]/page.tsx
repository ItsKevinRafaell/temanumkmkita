import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogCard from "@/components/blog/BlogCard";
import { type BlogPost, type ContentBlock } from "@/lib/data/blog";
import { type Article } from "@/lib/api/blog";
import { UserCircle, ExternalLink } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.temanumkmkita.com";
const SITE_URL = "https://temanumkmkita.com";

interface AuthorData {
  id: string;
  name: string;
  slug: string;
  role: string | null;
  bio: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
}

async function fetchAuthorBySlug(slug: string): Promise<AuthorData> {
  const res = await fetch(`${API_BASE}/api/authors/by-slug/${slug}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Author not found");
  return res.json();
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
    readTime: a.read_time,
    featured: a.featured,
    cover_image: a.cover_image ?? undefined,
    content,
  };
}

async function fetchArticlesByAuthor(authorId: string): Promise<BlogPost[]> {
  const res = await fetch(`${API_BASE}/api/articles?author_id=${authorId}&per_page=50`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items as Article[]).map(articleToPost);
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const author = await fetchAuthorBySlug(slug);
    return {
      title: `${author.name} — Penulis di Teman UMKM Kita`,
      description: author.bio ?? `Artikel oleh ${author.name}${author.role ? `, ${author.role}` : ""} di Teman UMKM Kita.`,
      alternates: { canonical: `${SITE_URL}/blog/author/${slug}` },
    };
  } catch {
    return {};
  }
}

export default async function AuthorPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let author: AuthorData;
  try {
    author = await fetchAuthorBySlug(slug);
  } catch {
    notFound();
  }

  const posts = await fetchArticlesByAuthor(author.id).catch(() => [] as BlogPost[]);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${SITE_URL}/blog/author/${author.slug}`,
    ...(author.role ? { jobTitle: author.role } : {}),
    ...(author.bio ? { description: author.bio } : {}),
    ...(author.photo_url ? { image: author.photo_url } : {}),
    ...(author.linkedin_url ? { sameAs: [author.linkedin_url] } : {}),
    worksFor: { "@type": "Organization", name: "Teman UMKM Kita", url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Navbar />
      <main className="pt-20">
        <section className="pt-12 pb-10 border-b border-brand-dark/8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-6">
              {author.photo_url ? (
                <img src={author.photo_url} alt={author.name} className="w-20 h-20 rounded-full object-cover border border-brand-dark/8 flex-shrink-0" />
              ) : (
                <UserCircle size={80} className="text-brand-dark/20 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">{author.name}</h1>
                {author.role && <p className="text-sm text-brand-dark/55 mt-1 font-medium">{author.role}</p>}
                {author.bio && <p className="text-sm text-brand-dark/65 mt-3 leading-relaxed max-w-lg">{author.bio}</p>}
                {author.linkedin_url && (
                  <a
                    href={author.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-brand-dark/45 hover:text-accent transition-colors"
                  >
                    <ExternalLink size={12} /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-extrabold text-brand-dark mb-6">
              Artikel oleh {author.name}
              <span className="ml-2 text-sm font-semibold text-brand-dark/35">({posts.length})</span>
            </h2>
            {posts.length === 0 ? (
              <p className="text-sm text-brand-dark/40">Belum ada artikel yang dipublikasikan.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((p) => <BlogCard key={p.slug} post={p} />)}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
