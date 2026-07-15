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
    <div className="flex items-start gap-10">
      {/* ── Article body (70%) ──────────────────────────────────────── */}
      <article className="min-w-0 flex-1">
        {/* Featured image */}
        {post.cover_image ? (
          <div className="border-brand-dark/8 relative mb-8 h-64 w-full overflow-hidden rounded-lg border sm:h-80">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ) : (
          <div
            className={`border-brand-dark/8 mb-8 flex h-64 w-full items-center justify-center rounded-lg border sm:h-80 ${
              {
                Website: "bg-blue-50",
                "SEO & Google Maps": "bg-green-50",
                SEO: "bg-green-50",
                "Sosial Media": "bg-pink-50",
                Branding: "bg-purple-50",
                Maintenance: "bg-cyan-50",
                "Tips Bisnis": "bg-amber-50",
              }[post.category] ?? "bg-brand-dark/5"
            }`}
          >
            <span className="select-none text-6xl font-black uppercase tracking-widest text-brand-dark/10">
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
            <h3 className="mb-6 text-xl font-extrabold text-brand-dark">Artikel Terkait</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        )}
      </article>

      {/* ── Sidebar (30%) ───────────────────────────────────────────── */}
      <aside className="sticky top-28 hidden w-72 flex-shrink-0 flex-col gap-5 lg:flex">
        {/* ToC */}
        <TableOfContents headings={headings} />

        {/* Sidebar CTA */}
        <div className="rounded-lg border border-accent/30 bg-accent/10 p-5">
          <p className="mb-1 text-sm font-bold text-brand-dark">Butuh bantuan digital?</p>
          <p className="mb-4 text-xs leading-relaxed text-brand-dark/55">
            Konsultasi gratis — kami rekomendasikan layanan yang sesuai kebutuhan bisnis Anda.
          </p>
          <a
            href={
              WA_BASE +
              encodeURIComponent(
                `Halo, saya baca artikel "${post.title}" dan ingin konsultasi layanan digital untuk bisnis saya.`
              )
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-bold text-white no-underline transition-colors duration-200 hover:bg-accent/90"
          >
            <MessageCircle size={14} />
            Konsultasi Gratis
          </a>
        </div>

        {/* Popular posts */}
        <div className="border-brand-dark/8 card-shadow rounded-lg border bg-white p-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-dark/40">
            Artikel Terkait
          </p>
          {related.length > 0 ? (
            <ul className="space-y-4">
              {related.map((p) => (
                <li key={p.slug}>
                  <a href={`/blog/${p.slug}`} className="group block">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-brand-dark/80 transition-colors group-hover:text-accent">
                      {p.title}
                    </p>
                    <p className="mt-1 text-xs text-brand-dark/35">{p.readTime} menit baca</p>
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
    if (t.startsWith("*") && t.endsWith("*") && !t.startsWith("**"))
      return <em key={i}>{t.slice(1, -1)}</em>;
    const m = t.match(/^\[(.+?)\]\((.+?)\)$/);
    if (m)
      return (
        <a
          key={i}
          href={m[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 transition-colors hover:text-accent/80"
        >
          {m[1]}
        </a>
      );
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
        <h2 key={i} id={b.id}>
          {b.text}
        </h2>
      );
      // Insert inline CTA after 2nd h2
      if (h2Seen === 2) {
        elements.push(<InlineCTA key={`cta-${i}`} postTitle={postTitle} />);
      }
    } else if (b.type === "h3") {
      elements.push(
        <h3 key={i} id={b.id}>
          {b.text}
        </h3>
      );
    } else if (b.type === "p") {
      elements.push(<p key={i}>{renderInline(b.text)}</p>);
    } else if (b.type === "ul") {
      elements.push(
        <ul key={i}>
          {b.items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    } else if (b.type === "ol") {
      elements.push(
        <ol key={i}>
          {b.items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
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
            className="border-brand-dark/8 w-full rounded-lg border object-cover"
            loading="lazy"
          />
          {b.caption && (
            <figcaption className="mt-2 text-center text-xs text-brand-dark/40">
              {b.caption}
            </figcaption>
          )}
        </figure>
      );
    } else if (b.type === "divider") {
      elements.push(<hr key={i} className="not-prose my-10 border-t-2 border-accent/20" />);
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
          <h3 className="mb-3 text-base font-extrabold text-brand-dark">Pertanyaan Umum</h3>
          <div className="space-y-2">
            {b.items.map((item, j) => (
              <details
                key={j}
                className="group overflow-hidden rounded-lg border border-brand-dark/10"
              >
                <summary className="flex cursor-pointer select-none list-none items-center justify-between px-4 py-3 text-sm font-semibold text-brand-dark">
                  {item.question}
                  <ChevronRight
                    size={14}
                    className="flex-shrink-0 text-brand-dark/40 transition-transform group-open:rotate-90"
                  />
                </summary>
                <p className="px-4 pb-4 text-sm leading-relaxed text-brand-dark/65">
                  {item.answer}
                </p>
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
                <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-accent text-xs font-bold text-white">
                  {j + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-brand-dark">{step.name}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-brand-dark/65">{step.text}</p>
                  {step.image && (
                    <Image
                      src={step.image}
                      alt={step.name}
                      width={600}
                      height={192}
                      className="border-brand-dark/8 mt-2 max-h-48 w-full rounded-lg border object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      );
    } else if (b.type === "key-takeaway") {
      elements.push(
        <div key={i} className="not-prose bg-accent/8 my-6 rounded-lg border border-accent/25 p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
            Yang akan kamu pelajari
          </p>
          <ul className="space-y-2">
            {b.items.filter(Boolean).map((item, j) => (
              <li key={j} className="flex items-start gap-2.5 text-sm text-brand-dark/80">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-sm bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    } else if (b.type === "source") {
      elements.push(
        <div key={i} className="not-prose border-brand-dark/8 my-8 border-t pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-dark/35">
            Referensi
          </p>
          <ol className="space-y-1.5">
            {b.items
              .filter((s) => s.label || s.url)
              .map((src, j) => (
                <li key={j} className="flex items-start gap-2 text-xs text-brand-dark/55">
                  <span className="flex-shrink-0 font-mono text-brand-dark/30">[{j + 1}]</span>
                  {src.url ? (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="underline underline-offset-2 transition-colors hover:text-accent"
                    >
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
        <div key={i} className="not-prose my-6 border-l-4 border-accent/50 py-1 pl-5">
          <p className="text-base italic leading-relaxed text-brand-dark/80">
            &ldquo;{b.quote}&rdquo;
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-dark/50">
            <span className="font-bold text-brand-dark/70">{b.author_name}</span>
            {b.author_title && (
              <>
                <span>·</span>
                <span>{b.author_title}</span>
              </>
            )}
            {b.author_company && (
              <>
                <span>·</span>
                <span>{b.author_company}</span>
              </>
            )}
          </div>
        </div>
      );
    }
  }

  return <>{elements}</>;
}

function InlineCTA({ postTitle }: { postTitle: string }) {
  return (
    <div className="not-prose my-8 flex flex-col gap-4 rounded-lg border border-accent/30 bg-accent/10 p-6 sm:flex-row sm:items-center">
      <div className="flex-1">
        <p className="mb-1 text-base font-bold text-brand-dark">
          Butuh bantuan mengoptimalkan bisnis Anda?
        </p>
        <p className="text-sm leading-relaxed text-brand-dark/60">
          Tim Teman UMKM Kita siap konsultasi gratis — tanpa komitmen apapun.
        </p>
      </div>
      <a
        href={`${WA_BASE}${encodeURIComponent(`Halo, saya baca artikel "${postTitle}" dan ingin konsultasi layanan digital.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold !text-white !no-underline transition-colors duration-200 hover:bg-accent/90"
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
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  return (
    <div className="border-brand-dark/8 mt-10 flex flex-wrap items-center gap-2 border-t pt-6">
      <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/40">
        Bagikan:
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-neutral-900/8 rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-900 transition-colors hover:bg-neutral-900/15"
      >
        X / Twitter
      </a>
      <a
        href={`https://wa.me/?text=${enc(title + " " + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition-colors hover:bg-green-100"
      >
        WhatsApp
      </a>
      <button
        onClick={copyLink}
        className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
      >
        {copied ? "Tersalin!" : "Salin Link"}
      </button>
    </div>
  );
}
