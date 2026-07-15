"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, PenLine, ChevronLeft, Loader2, Users } from "lucide-react";
import { fetchAuthors, deleteAuthor, type Author } from "@/lib/api/admin";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AuthorsPage() {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthors()
      .then(setAuthors)
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function confirmDelete() {
    if (!modal) return;
    setDeleting(modal.id);
    try {
      await deleteAuthor(modal.id);
      setAuthors((prev) => prev.filter((a) => a.id !== modal.id));
    } finally {
      setDeleting(null);
      setModal(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      <header className="border-[#242423]/8 sticky top-0 z-20 flex items-center justify-between border-b bg-white px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="flex items-center gap-1 text-xs text-[#242423]/50 transition hover:text-[#242423]"
          >
            <ChevronLeft size={13} /> Artikel
          </Link>
          <span className="text-[#242423]/20">/</span>
          <span className="text-sm font-bold text-[#242423]">Penulis</span>
        </div>
        <Link
          href="/admin/authors/new"
          className="flex items-center gap-1.5 rounded-lg bg-[#f5a700] px-4 py-1.5 text-sm font-bold text-white transition hover:bg-[#f5a700]/90"
        >
          <Plus size={13} /> Tambah Penulis
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#242423]/30" />
          </div>
        ) : authors.length === 0 ? (
          <div className="py-20 text-center">
            <Users size={32} className="mx-auto mb-3 text-[#242423]/20" />
            <p className="text-sm text-[#242423]/40">Belum ada penulis. Tambah penulis pertama.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {authors.map((author) => (
              <div
                key={author.id}
                className="border-[#242423]/8 flex items-center gap-4 rounded-2xl border bg-white p-4"
              >
                {author.photo_url ? (
                  <Image
                    src={author.photo_url}
                    alt={author.name}
                    width={48}
                    height={48}
                    className="border-[#242423]/8 flex-shrink-0 rounded-full border object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#f5a700]/15">
                    <span className="text-lg font-extrabold text-[#f5a700]">{author.name[0]}</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#242423]">{author.name}</p>
                  {author.role && <p className="mt-0.5 text-xs text-[#242423]/50">{author.role}</p>}
                </div>
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/authors/${author.id}`}
                    className="rounded-lg p-2 text-[#242423]/40 transition hover:bg-[#242423]/5 hover:text-[#242423]"
                  >
                    <PenLine size={14} />
                  </Link>
                  <button
                    onClick={() => setModal({ id: author.id, name: author.name })}
                    className="rounded-lg p-2 text-[#242423]/40 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modal && (
        <ConfirmModal
          open={true}
          title="Hapus penulis?"
          message={`"${modal.name}" akan dihapus permanen.`}
          confirmLabel={deleting ? "Menghapus..." : "Hapus"}
          onConfirm={confirmDelete}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
