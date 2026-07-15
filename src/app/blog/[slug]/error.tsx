"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function BlogDetailError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <AlertCircle size={40} className="text-brand-dark/25" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-brand-dark">Artikel Tidak Dapat Dimuat</h2>
        <p className="mb-6 text-sm leading-relaxed text-brand-dark/55">
          Terjadi kesalahan saat mengambil artikel. Coba lagi atau kembali ke daftar artikel.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent/90"
          >
            Coba Lagi
          </button>
          <Link
            href="/blog"
            className="rounded-lg border border-brand-dark/15 px-6 py-2.5 text-sm font-bold text-brand-dark/70 transition-colors hover:border-accent hover:text-accent"
          >
            Kembali
          </Link>
        </div>
      </div>
    </div>
  );
}
