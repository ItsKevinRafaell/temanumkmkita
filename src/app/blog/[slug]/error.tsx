"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function BlogDetailError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <AlertCircle size={40} className="text-brand-dark/25" />
        </div>
        <h2 className="text-xl font-bold text-brand-dark mb-2">Artikel Tidak Dapat Dimuat</h2>
        <p className="text-brand-dark/55 text-sm mb-6 leading-relaxed">
          Terjadi kesalahan saat mengambil artikel. Coba lagi atau kembali ke daftar artikel.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-accent text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-accent/90 transition-colors"
          >
            Coba Lagi
          </button>
          <Link
            href="/blog"
            className="border border-brand-dark/15 text-brand-dark/70 font-bold px-6 py-2.5 rounded-lg text-sm hover:border-accent hover:text-accent transition-colors"
          >
            Kembali
          </Link>
        </div>
      </div>
    </div>
  );
}
