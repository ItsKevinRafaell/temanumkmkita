"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminGetArticle, type AdminArticle } from "@/lib/api/admin";
import PostEditor from "@/components/blog/PostEditor";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<AdminArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetArticle(id)
      .then(setArticle)
      .catch(() => router.push("/admin/posts"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center text-sm text-[#242423]/40">
        Memuat...
      </div>
    );
  }

  if (!article) return null;

  return (
    <PostEditor
      initial={{
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt ?? "",
        category: article.category ?? "",
        status: article.status as "draft" | "published",
        featured: article.featured,
        read_time: article.read_time,
        published_at: article.published_at ?? undefined,
        content: article.content,
        cover_image: article.cover_image ?? "",
        seo_title: article.seo_title ?? undefined,
        meta_description: article.meta_description ?? undefined,
        focus_keyword: article.focus_keyword ?? undefined,
      }}
    />
  );
}
