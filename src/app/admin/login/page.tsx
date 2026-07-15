"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/api/admin";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin/posts";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await login(email, password);
      document.cookie = `admin_token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
      router.push(from);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-[#242423]/8 space-y-4 rounded-2xl border bg-white p-7 shadow-sm"
    >
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[#242423]/60">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          className="w-full rounded-xl border border-[#242423]/15 bg-white px-3.5 py-2.5 text-sm text-[#242423] transition focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/40"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[#242423]/60">Password</label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-[#242423]/15 bg-white px-3.5 py-2.5 pr-10 text-sm text-[#242423] transition focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/40"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#242423]/30 hover:text-[#242423]/60"
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#f5a700] py-2.5 text-sm font-bold text-white transition hover:bg-[#f5a700]/90 disabled:opacity-60"
      >
        {loading ? "Masuk..." : "Masuk"}
      </button>
      <Link
        href="/admin/reset-password"
        className="block text-center text-xs font-semibold text-[#9a6a00] hover:text-[#242423]"
      >
        Lupa password?
      </Link>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfaf7] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image
            src="/brand/logo-secondary-yellow.png"
            alt="Teman UMKM Kita"
            width={320}
            height={76}
            className="mx-auto mb-4 h-16 w-auto object-contain"
            priority
          />
          <h1 className="text-2xl font-extrabold text-[#242423]">Admin Panel</h1>
          <p className="mt-1 text-sm text-[#242423]/50">Teman UMKM Kita CMS</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
