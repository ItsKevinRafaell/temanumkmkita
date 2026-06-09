"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function BlogError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <AlertCircle size={40} className="text-brand-dark/25" />
        </div>
        <h2 className="text-xl font-bold text-brand-dark mb-2">Gagal Memuat Artikel</h2>
        <p className="text-brand-dark/55 text-sm mb-6 leading-relaxed">
          Terjadi kesalahan saat mengambil data. Coba lagi beberapa saat.
        </p>
        <button
          onClick={reset}
          className="bg-accent text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-accent/90 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
