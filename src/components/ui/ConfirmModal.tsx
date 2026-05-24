"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Hapus",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#242423]/40 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center text-[#242423]/35 hover:text-[#242423] hover:bg-[#242423]/6 rounded-lg transition"
        >
          <X size={14} />
        </button>

        {/* Icon + title */}
        <div className="flex items-start gap-4 mb-4">
          {danger && (
            <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
          )}
          <div className="pt-1">
            <h3 className="font-extrabold text-[#242423] text-base leading-snug">{title}</h3>
            <p className="text-sm text-[#242423]/55 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 justify-end mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-[#242423]/60 border border-[#242423]/12 rounded-xl hover:border-[#242423]/25 hover:text-[#242423] transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-bold text-white rounded-xl transition ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#f5a700] hover:bg-[#f5a700]/90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
