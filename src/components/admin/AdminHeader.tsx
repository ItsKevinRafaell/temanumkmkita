"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, LogOut, FileText } from "lucide-react";
import { logout } from "@/lib/api/admin";

interface Props {
  title: string;
  backHref?: string;
}

export default function AdminHeader({ title, backHref = "/admin" }: Props) {
  const router = useRouter();

  function handleLogout() {
    logout();
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  }

  return (
    <header className="border-[#242423]/8 sticky top-0 z-20 flex items-center justify-between border-b bg-white px-4 py-3.5 shadow-sm sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href={backHref}
          className="flex items-center gap-1 text-xs text-[#242423]/50 transition hover:text-[#242423]"
        >
          <ChevronLeft size={13} /> Kembali
        </Link>
        <span className="text-[#242423]/20">/</span>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#f5a700]">
            <FileText size={13} className="text-white" />
          </div>
          <span className="text-sm font-bold text-[#242423]">{title}</span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-xs text-[#242423]/50 transition hover:text-[#242423]"
      >
        <LogOut size={13} /> Keluar
      </button>
    </header>
  );
}
