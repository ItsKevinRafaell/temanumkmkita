import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/data/blog";

const categoryColors: Record<string, string> = {
  Website: "bg-blue-50 text-blue-700 border-blue-100",
  SEO: "bg-green-50 text-green-700 border-green-100",
  "Sosial Media": "bg-pink-50 text-pink-700 border-pink-100",
  Branding: "bg-purple-50 text-purple-700 border-purple-100",
  "Tips Bisnis": "bg-amber-50 text-amber-700 border-amber-100",
};

const categoryBg: Record<string, string> = {
  Website: "bg-blue-50",
  SEO: "bg-green-50",
  "Sosial Media": "bg-pink-50",
  Branding: "bg-purple-50",
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
}

export default function BlogCard({ post }: BlogCardProps) {
  const colorClass = categoryColors[post.category] ?? "bg-brand-dark/5 text-brand-dark/60 border-brand-dark/10";
  const bgClass = categoryBg[post.category] ?? "bg-brand-dark/5";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      {/* Thumbnail placeholder */}
      <div className={`h-44 ${bgClass} border-b border-brand-dark/6 flex items-center justify-center relative`}>
        <div className="text-4xl font-black text-brand-dark/10 select-none uppercase tracking-widest">
          {post.category.slice(0, 3)}
        </div>
        {post.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <span
          className={`self-start text-xs font-bold px-2.5 py-1 rounded-full border ${colorClass}`}
        >
          {post.category}
        </span>

        <h3 className="font-bold text-brand-dark leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-brand-dark/55 leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-brand-dark/5">
          <div className="flex items-center gap-3 text-xs text-brand-dark/40 font-medium">
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
            className="text-brand-dark/25 group-hover:text-accent group-hover:translate-x-1 transition-all duration-200"
          />
        </div>
      </div>
    </Link>
  );
}
