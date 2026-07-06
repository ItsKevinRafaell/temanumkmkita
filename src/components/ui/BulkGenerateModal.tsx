"use client";

import { useState } from "react";
import Image from "next/image";
import { generateCover, type GenerateCoverResponse } from "@/lib/api/imaginer";
import { X, Sparkles, Loader2, RefreshCw, Check, ChevronRight } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  cover_image?: string | null;
}

interface GeneratedResult {
  article: Article;
  result: GenerateCoverResponse | null;
  error?: string;
  status: "pending" | "generating" | "done" | "error";
}

interface BulkGenerateModalProps {
  open: boolean;
  onClose: () => void;
  articles: Article[];
  onComplete: () => void;
}

const BATCH_SIZES = [5, 10, 20];

export default function BulkGenerateModal({
  open,
  onClose,
  articles,
  onComplete,
}: BulkGenerateModalProps) {
  const [batchSize, setBatchSize] = useState(5);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [phase, setPhase] = useState<"select" | "generating" | "preview">("select");
  const [currentBatch, setCurrentBatch] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);

  const totalBatches = Math.ceil(articles.length / batchSize);
  const currentArticles = articles.slice(
    currentBatch * batchSize,
    (currentBatch + 1) * batchSize
  );

  async function startGenerate() {
    setPhase("generating");
    setResults([]);
    setCurrentIdx(0);

    for (let i = 0; i < currentArticles.length; i++) {
      const article = currentArticles[i];
      setCurrentIdx(i);
      setResults((prev) => [
        ...prev,
        { article, result: null, status: "generating" },
      ]);

      try {
        const result = await generateCover(article.id);
        setResults((prev) =>
          prev.map((r) =>
            r.article.id === article.id
              ? { ...r, result, status: "done" as const }
              : r
          )
        );
      } catch (err) {
        setResults((prev) =>
          prev.map((r) =>
            r.article.id === article.id
              ? {
                  ...r,
                  error: err instanceof Error ? err.message : "Gagal generate",
                  status: "error" as const,
                }
              : r
          )
        );
      }
    }

    setPhase("preview");
  }

  async function handleRegenerate(articleId: string) {
    const article = currentArticles.find((a) => a.id === articleId);
    if (!article) return;

    setResults((prev) =>
      prev.map((r) =>
        r.article.id === articleId
          ? { ...r, status: "generating" as const, error: undefined }
          : r
      )
    );

    try {
      const result = await generateCover(articleId);
      setResults((prev) =>
        prev.map((r) =>
          r.article.id === articleId
            ? { ...r, result, status: "done" as const }
            : r
        )
      );
    } catch (err) {
      setResults((prev) =>
        prev.map((r) =>
          r.article.id === articleId
            ? {
                ...r,
                error: err instanceof Error ? err.message : "Gagal generate",
                status: "error" as const,
              }
            : r
        )
      );
    }
  }

  function handleNextBatch() {
    if (currentBatch < totalBatches - 1) {
      setCurrentBatch((b) => b + 1);
      setPhase("select");
      setResults([]);
    } else {
      onComplete();
      onClose();
    }
  }

  function handleDone() {
    onComplete();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242423]/8">
          <div>
            <h2 className="text-lg font-extrabold text-[#242423]">
              Generate Cover Images
            </h2>
            <p className="text-xs text-[#242423]/50 mt-0.5">
              {articles.length} artikel belum punya cover
              {totalBatches > 1 &&
                ` · Batch ${currentBatch + 1} dari ${totalBatches}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#242423]/40 hover:bg-[#242423]/5 hover:text-[#242423] transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Phase: Select batch size */}
          {phase === "select" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#242423]/70 mb-2">
                  Jumlah artikel per batch
                </label>
                <div className="flex gap-2">
                  {BATCH_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setBatchSize(size)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                        batchSize === size
                          ? "border-[#f5a700] bg-[#f5a700] text-white"
                          : "border-[#242423]/12 text-[#242423]/60 hover:border-[#f5a700]/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#242423]/70 mb-2">
                  Artikel di batch ini
                </label>
                <div className="bg-[#242423]/3 rounded-xl p-4 space-y-2 max-h-60 overflow-y-auto">
                  {currentArticles.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-[#242423]/15 flex-shrink-0" />
                      <span className="text-[#242423]/80 line-clamp-1">
                        {article.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phase: Generating */}
          {phase === "generating" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-[#242423]/60">
                <Loader2 size={16} className="animate-spin text-[#f5a700]" />
                <span>
                  Generating {currentIdx + 1} / {currentArticles.length}...
                </span>
              </div>

              <div className="space-y-3">
                {results.map((r) => (
                  <div
                    key={r.article.id}
                    className="flex items-center gap-4 p-3 rounded-xl border border-[#242423]/8"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      {r.status === "generating" && (
                        <Loader2
                          size={14}
                          className="animate-spin text-[#f5a700]"
                        />
                      )}
                      {r.status === "done" && (
                        <Check size={14} className="text-green-600" />
                      )}
                      {r.status === "error" && (
                        <X size={14} className="text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#242423] line-clamp-1">
                        {r.article.title}
                      </p>
                      {r.error && (
                        <p className="text-xs text-red-500 mt-0.5">
                          {r.error}
                        </p>
                      )}
                    </div>
                    {r.status === "done" && r.result && (
                      <Image
                        src={r.result.cover_image_url}
                        alt={r.article.title}
                        width={80}
                        height={45}
                        className="rounded-lg object-cover border border-[#242423]/8"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phase: Preview */}
          {phase === "preview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((r) => (
                  <div
                    key={r.article.id}
                    className="border border-[#242423]/8 rounded-xl overflow-hidden"
                  >
                    <div className="relative aspect-video bg-[#242423]/5">
                      {r.result?.cover_image_url ? (
                        <Image
                          src={r.result.cover_image_url}
                          alt={r.article.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-[#242423]/30">
                          Gagal generate
                        </div>
                      )}
                      {r.status === "generating" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Loader2
                            size={20}
                            className="animate-spin text-white"
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <p className="text-xs font-medium text-[#242423] line-clamp-1 flex-1 mr-2">
                        {r.article.title}
                      </p>
                      <button
                        onClick={() => handleRegenerate(r.article.id)}
                        disabled={r.status === "generating"}
                        className="flex items-center gap-1 text-xs text-[#242423]/50 hover:text-[#f5a700] disabled:opacity-50 transition"
                      >
                        <RefreshCw size={12} />
                        Ulang
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#242423]/8 bg-[#fcfaf7]">
          {phase === "select" && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-[#242423]/50 hover:text-[#242423] transition"
              >
                Batal
              </button>
              <button
                onClick={startGenerate}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#f5a700] text-white font-bold text-sm rounded-xl hover:bg-[#f5a700]/90 transition"
              >
                <Sparkles size={14} />
                Generate Batch {currentBatch + 1}
              </button>
            </>
          )}

          {phase === "generating" && (
            <div className="flex-1 text-center text-sm text-[#242423]/40">
              Sedang generate, mohon tunggu...
            </div>
          )}

          {phase === "preview" && (
            <>
              <button
                onClick={handleDone}
                className="px-4 py-2 text-sm font-semibold text-[#242423]/50 hover:text-[#242423] transition"
              >
                Selesai
              </button>
              {currentBatch < totalBatches - 1 && (
                <button
                  onClick={handleNextBatch}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#f5a700] text-white font-bold text-sm rounded-xl hover:bg-[#f5a700]/90 transition"
                >
                  Batch Berikutnya
                  <ChevronRight size={14} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
