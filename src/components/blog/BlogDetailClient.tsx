"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import TableOfContents from "@/components/blog/TableOfContents";
import BlogCard from "@/components/blog/BlogCard";
import type { BlogPost } from "@/lib/data/blog";
import { MessageCircle, ChevronRight } from "lucide-react";

const WA_BASE = "https://wa.me/6289501925395?text=";

interface Props {
  post: BlogPost;
  related: BlogPost[];
  headings: { id: string; text: string; level: 2 | 3 }[];
}

export default function BlogDetailClient({ post, related, headings }: Props) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="flex gap-10 items-start">

      {/* ── Article body (70%) ──────────────────────────────────────── */}
      <article className="min-w-0 flex-1">

        {/* Featured image */}
        {post.cover_image ? (
          <div className="w-full h-64 sm:h-80 rounded-2xl mb-8 overflow-hidden border border-brand-dark/8 relative">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        ) : (
          <div
            className={`w-full h-64 sm:h-80 rounded-2xl mb-8 flex items-center justify-center border border-brand-dark/8 ${
              {
                Website: "bg-blue-50",
                SEO: "bg-green-50",
                "Sosial Media": "bg-pink-50",
                Branding: "bg-purple-50",
                "Tips Bisnis": "bg-amber-50",
              }[post.category] ?? "bg-brand-dark/5"
            }`}
          >
            <span className="text-6xl font-black text-brand-dark/10 uppercase tracking-widest select-none">
              {post.category.slice(0, 3)}
            </span>
          </div>
        )}

        {/* Prose */}
        <div className="blog-prose">
          <BlogContent blocks={post.content} postTitle={post.title} />
        </div>
        <ShareButtons title={post.title} slug={post.slug} />

        {/* Related posts — mobile/tablet */}
        {related.length > 0 && (
          <div className="mt-16 lg:hidden">
            <h3 className="text-xl font-extrabold text-brand-dark mb-6">Artikel Terkait</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((p) => <BlogCard key={p.slug} post={p} />)}
            </div>
          </div>
        )}
      </article>

      {/* ── Sidebar (30%) ───────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col gap-5 w-72 flex-shrink-0 sticky top-28">

        {/* ToC */}
        <TableOfContents headings={headings} />

        {/* Sidebar CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5">
          <p className="text-sm font-bold text-brand-dark mb-1">Butuh bantuan digital?</p>
          <p className="text-xs text-brand-dark/55 mb-4 leading-relaxed">
            Konsultasi gratis — kami rekomendasikan layanan yang sesuai kebutuhan bisnis Anda.
          </p>
          <a
            href={WA_BASE + encodeURIComponent(`Halo, saya baca artikel "${post.title}" dan ingin konsultasi layanan digital untuk bisnis saya.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-accent text-white no-underline font-bold py-2.5 rounded-xl text-sm hover:bg-accent/90 transition-colors duration-200"
          >
            <MessageCircle size={14} />
            Konsultasi Gratis
          </a>
        </div>

        {/* Popular posts */}
        <div className="bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-dark/40 mb-4">
            Artikel Terkait
          </p>
          {related.length > 0 ? (
            <ul className="space-y-4">
              {related.map((p) => (
                <li key={p.slug}>
                  <a
                    href={`/blog/${p.slug}`}
                    className="block group"
                  >
                    <p className="text-sm font-semibold text-brand-dark/80 group-hover:text-accent transition-colors leading-snug line-clamp-2">
                      {p.title}
                    </p>
                    <p className="text-xs text-brand-dark/35 mt-1">{p.readTime} menit baca</p>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-brand-dark/40">Belum ada artikel terkait.</p>
          )}
        </div>
      </aside>
    </div>
  );
}

/* ── Article content renderer ─────────────────────────────────────────────── */

function renderInline(text: string): React.ReactNode[] {
  const tokens = text.split(/(\*\*.+?\*\*|\*.+?\*|\[.+?\]\(.+?\))/g);
  return tokens.map((t, i) => {
    if (t.startsWith("**") && t.endsWith("**")) return <strong key={i}>{t.slice(2, -2)}</strong>;
    if (t.startsWith("*") && t.endsWith("*") && !t.startsWith("**")) return <em key={i}>{t.slice(1, -1)}</em>;
    const m = t.match(/^\[(.+?)\]\((.+?)\)$/);
    if (m) return <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors">{m[1]}</a>;
    return t;
  });
}

function BlogContent({ blocks, postTitle }: { blocks: BlogPost["content"]; postTitle: string }) {
  const elements: React.ReactNode[] = [];
  let h2Seen = 0;

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];

    if (b.type === "h2") {
      h2Seen++;
      elements.push(
        <h2 key={i} id={b.id}>{b.text}</h2>
      );
      // Insert inline CTA after 2nd h2
      if (h2Seen === 2) {
        elements.push(<InlineCTA key={`cta-${i}`} postTitle={postTitle} />);
      }
    } else if (b.type === "h3") {
      elements.push(<h3 key={i} id={b.id}>{b.text}</h3>);
    } else if (b.type === "p") {
      elements.push(<p key={i}>{renderInline(b.text)}</p>);
    } else if (b.type === "ul") {
      elements.push(
        <ul key={i}>
          {b.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
        </ul>
      );
    } else if (b.type === "ol") {
      elements.push(
        <ol key={i}>
          {b.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
        </ol>
      );
    } else if (b.type === "blockquote") {
      elements.push(<blockquote key={i}>{renderInline(b.text)}</blockquote>);
    } else if (b.type === "cta-inline") {
      elements.push(<InlineCTA key={i} postTitle={postTitle} />);
    } else if (b.type === "image") {
      elements.push(
        <figure key={i} className="not-prose my-8">
          <Image
            src={b.src}
            alt={b.alt}
            width={800}
            height={450}
            className="w-full rounded-2xl border border-brand-dark/8 object-cover"
            loading="lazy"
          />
          {b.caption && (
            <figcaption className="text-center text-xs text-brand-dark/40 mt-2">
              {b.caption}
            </figcaption>
          )}
        </figure>
      );
    } else if (b.type === "divider") {
      elements.push(
        <hr key={i} className="not-prose my-10 border-t-2 border-accent/20" />
      );
    } else if (b.type === "columns") {
      elements.push(
        <div
          key={i}
          className={`not-prose my-6 grid gap-4 ${b.count === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}
        >
          {b.columns.map((col, ci) => (
            <div key={ci} className="blog-prose">
              <BlogContent blocks={col} postTitle={postTitle} />
            </div>
          ))}
        </div>
      );
    } else if (b.type === "faq") {
      elements.push(
        <div key={i} className="not-prose my-8">
          <h3 className="text-base font-extrabold text-brand-dark mb-3">Pertanyaan Umum</h3>
          <div className="space-y-2">
            {b.items.map((item, j) => (
              <details key={j} className="group border border-brand-dark/10 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer font-semibold text-sm text-brand-dark select-none list-none">
                  {item.question}
                  <ChevronRight size={14} className="flex-shrink-0 text-brand-dark/40 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-4 pb-4 text-sm text-brand-dark/65 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      );
    } else if (b.type === "howto") {
      elements.push(
        <div key={i} className="not-prose my-8">
          <ol className="space-y-4">
            {b.steps.map((step, j) => (
              <li key={j} className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">{j + 1}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-brand-dark">{step.name}</p>
                  <p className="text-sm text-brand-dark/65 mt-0.5 leading-relaxed">{step.text}</p>
                  {step.image && (
                    <Image src={step.image} alt={step.name} width={600} height={192} className="mt-2 w-full rounded-xl border border-brand-dark/8 object-cover max-h-48" loading="lazy" />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      );
    } else if (b.type === "key-takeaway") {
      elements.push(
        <div key={i} className="not-prose my-6 bg-accent/8 border border-accent/25 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Yang akan kamu pelajari</p>
          <ul className="space-y-2">
            {b.items.filter(Boolean).map((item, j) => (
              <li key={j} className="flex items-start gap-2.5 text-sm text-brand-dark/80">
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    } else if (b.type === "source") {
      elements.push(
        <div key={i} className="not-prose my-8 border-t border-brand-dark/8 pt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-dark/35 mb-3">Referensi</p>
          <ol className="space-y-1.5">
            {b.items.filter((s) => s.label || s.url).map((src, j) => (
              <li key={j} className="flex items-start gap-2 text-xs text-brand-dark/55">
                <span className="font-mono text-brand-dark/30 flex-shrink-0">[{j + 1}]</span>
                {src.url ? (
                  <a href={src.url} target="_blank" rel="nofollow noopener noreferrer" className="hover:text-accent underline underline-offset-2 transition-colors">
                    {src.label || src.url}
                  </a>
                ) : (
                  <span>{src.label}</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      );
    } else if (b.type === "expert-quote") {
      elements.push(
        <div key={i} className="not-prose my-6 border-l-4 border-accent/50 pl-5 py-1">
          <p className="text-base text-brand-dark/80 italic leading-relaxed">&ldquo;{b.quote}&rdquo;</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-dark/50">
            <span className="font-bold text-brand-dark/70">{b.author_name}</span>
            {b.author_title && <><span>·</span><span>{b.author_title}</span></>}
            {b.author_company && <><span>·</span><span>{b.author_company}</span></>}
          </div>
        </div>
      );
    }
  }

  return <>{elements}</>;
}

function InlineCTA({ postTitle }: { postTitle: string }) {
  return (
    <div className="not-prose my-8 bg-accent/10 border border-accent/30 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <p className="font-bold text-brand-dark text-base mb-1">
          Butuh bantuan mengoptimalkan bisnis Anda?
        </p>
        <p className="text-sm text-brand-dark/60 leading-relaxed">
          Tim Teman UMKM Kita siap konsultasi gratis — tanpa komitmen apapun.
        </p>
      </div>
      <a
        href={`${WA_BASE}${encodeURIComponent(`Halo, saya baca artikel "${postTitle}" dan ingin konsultasi layanan digital.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 inline-flex items-center gap-2 bg-accent !text-white !no-underline font-bold px-5 py-3 rounded-xl text-sm hover:bg-accent/90 transition-colors duration-200"
      >
        <MessageCircle size={14} />
        Konsultasi Gratis
      </a>
    </div>
  );
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://temanumkmkita.com/blog/${slug}`;
  const enc = encodeURIComponent;

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  return (
    <div className="flex items-center gap-2 mt-10 pt-6 border-t border-brand-dark/8 flex-wrap">
      <span className="text-xs font-bold text-brand-dark/40 uppercase tracking-wider">Bagikan:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`}
        target="_blank" rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg bg-neutral-900/8 text-xs font-semibold text-neutral-900 hover:bg-neutral-900/15 transition-colors"
      >
        X / Twitter
      </a>
      <a
        href={`https://wa.me/?text=${enc(title + " " + url)}`}
        target="_blank" rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg bg-green-50 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors"
      >
        WhatsApp
      </a>
      <button
        onClick={copyLink}
        className="px-3 py-1.5 rounded-lg bg-blue-50 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
      >
        {copied ? "Tersalin!" : "Salin Link"}
      </button>
    </div>
  );
}
