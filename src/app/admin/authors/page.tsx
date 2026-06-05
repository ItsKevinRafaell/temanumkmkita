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
      <header className="bg-white border-b border-[#242423]/8 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/posts" className="flex items-center gap-1 text-xs text-[#242423]/50 hover:text-[#242423] transition">
            <ChevronLeft size={13} /> Artikel
          </Link>
          <span className="text-[#242423]/20">/</span>
          <span className="text-sm font-bold text-[#242423]">Penulis</span>
        </div>
        <Link
          href="/admin/authors/new"
          className="flex items-center gap-1.5 bg-[#f5a700] text-white font-bold px-4 py-1.5 rounded-lg text-sm hover:bg-[#f5a700]/90 transition"
        >
          <Plus size={13} /> Tambah Penulis
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#242423]/30" />
          </div>
        ) : authors.length === 0 ? (
          <div className="text-center py-20">
            <Users size={32} className="text-[#242423]/20 mx-auto mb-3" />
            <p className="text-sm text-[#242423]/40">Belum ada penulis. Tambah penulis pertama.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {authors.map((author) => (
              <div key={author.id} className="bg-white border border-[#242423]/8 rounded-2xl p-4 flex items-center gap-4">
                {author.photo_url ? (
                  <Image src={author.photo_url} alt={author.name} width={48} height={48} className="rounded-full object-cover border border-[#242423]/8 flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#f5a700]/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#f5a700] font-extrabold text-lg">{author.name[0]}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#242423]">{author.name}</p>
                  {author.role && <p className="text-xs text-[#242423]/50 mt-0.5">{author.role}</p>}
                </div>
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/authors/${author.id}`}
                    className="p-2 text-[#242423]/40 hover:text-[#242423] hover:bg-[#242423]/5 rounded-lg transition"
                  >
                    <PenLine size={14} />
                  </Link>
                  <button
                    onClick={() => setModal({ id: author.id, name: author.name })}
                    className="p-2 text-[#242423]/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
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
