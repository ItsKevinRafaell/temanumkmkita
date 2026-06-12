"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/api/admin";
import { Eye, EyeOff, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin/posts";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await login(username, password);
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
      className="bg-white border border-[#242423]/8 rounded-2xl p-7 shadow-sm space-y-4"
    >
      <div>
        <label className="block text-xs font-semibold text-[#242423]/60 mb-1.5">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoFocus
          className="w-full border border-[#242423]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/40 focus:border-[#f5a700] transition"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#242423]/60 mb-1.5">Password</label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-[#242423]/15 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/40 focus:border-[#f5a700] transition"
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
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#f5a700] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#f5a700]/90 disabled:opacity-60 transition"
      >
        {loading ? "Masuk..." : "Masuk"}
      </button>
      <Link href="/admin/reset-password" className="block text-center text-xs font-semibold text-[#9a6a00] hover:text-[#242423]">
        Lupa password?
      </Link>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#f5a700]/10 rounded-2xl mb-4">
            <Lock size={20} className="text-[#f5a700]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#242423]">Admin Panel</h1>
          <p className="text-sm text-[#242423]/50 mt-1">Teman UMKM Kita CMS</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
