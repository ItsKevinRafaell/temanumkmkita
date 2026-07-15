"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/data/blog";

const categoryColors: Record<string, string> = {
  Website: "bg-blue-50 text-blue-700 border-blue-100",
  "SEO & Google Maps": "bg-green-50 text-green-700 border-green-100",
  SEO: "bg-green-50 text-green-700 border-green-100",
  "Sosial Media": "bg-pink-50 text-pink-700 border-pink-100",
  Branding: "bg-purple-50 text-purple-700 border-purple-100",
  Maintenance: "bg-cyan-50 text-cyan-700 border-cyan-100",
  "Tips Bisnis": "bg-amber-50 text-amber-700 border-amber-100",
};

const categoryBg: Record<string, string> = {
  Website: "bg-blue-50",
  "SEO & Google Maps": "bg-green-50",
  SEO: "bg-green-50",
  "Sosial Media": "bg-pink-50",
  Branding: "bg-purple-50",
  Maintenance: "bg-cyan-50",
  "Tips Bisnis": "bg-amber-50",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  priority?: boolean;
}

export default function BlogCard({ post, priority }: BlogCardProps) {
  const [imgError, setImgError] = useState(false);
  const colorClass =
    categoryColors[post.category] ?? "bg-brand-dark/5 text-brand-dark/60 border-brand-dark/10";
  const bgClass = categoryBg[post.category] ?? "bg-brand-dark/5";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="border-brand-dark/8 card-shadow group flex flex-col overflow-hidden rounded-lg border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Thumbnail */}
      <div
        className={`h-44 ${bgClass} border-brand-dark/6 relative flex items-center justify-center overflow-hidden border-b`}
      >
        {post.cover_image && !imgError ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="select-none text-4xl font-black uppercase tracking-widest text-brand-dark/10">
            {post.category.slice(0, 3)}
          </div>
        )}
        {post.featured && (
          <div className="absolute left-3 top-3">
            <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-bold text-white">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span
          className={`self-start rounded-md border px-2.5 py-1 text-xs font-bold ${colorClass}`}
        >
          {post.category}
        </span>

        <h3 className="line-clamp-2 font-bold leading-snug text-brand-dark transition-colors duration-200 group-hover:text-accent">
          {post.title}
        </h3>

        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-brand-dark/55">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between border-t border-brand-dark/5 pt-2">
          <div className="flex items-center gap-3 text-xs font-medium text-brand-dark/40">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={11} />
              {post.readTime} menit
            </span>
          </div>
          <ArrowRight
            size={14}
            className="text-brand-dark/25 transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent"
          />
        </div>
      </div>
    </Link>
  );
}
