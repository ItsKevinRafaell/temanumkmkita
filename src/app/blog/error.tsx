"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function BlogError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <AlertCircle size={40} className="text-brand-dark/25" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-brand-dark">Gagal Memuat Artikel</h2>
        <p className="mb-6 text-sm leading-relaxed text-brand-dark/55">
          Terjadi kesalahan saat mengambil data. Coba lagi beberapa saat.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent/90"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
