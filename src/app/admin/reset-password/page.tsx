"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";
import { requestPasswordReset, resetPassword } from "@/lib/api/admin";

function ResetPasswordForm() {
  const params = useSearchParams();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setToken(params.get("token") ?? "");
  }, [params]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      if (token) {
        await resetPassword(token, password);
        setPassword("");
        setMessage("Password berhasil diganti. Silakan login dengan password baru.");
      } else {
        const result = await requestPasswordReset(email);
        setMessage(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset password gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#242423]/8 bg-white p-7 shadow-sm">
      {token ? (
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#242423]/60">Password Baru</label>
          <input
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-[#242423]/15 bg-white px-3.5 py-2.5 text-sm text-[#242423] transition focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/40"
          />
        </div>
      ) : (
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#242423]/60">Email Admin</label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-[#242423]/15 bg-white px-3.5 py-2.5 text-sm text-[#242423] transition focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/40"
          />
        </div>
      )}

      {error && <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
      {message && <p className="rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-xs text-green-700">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f5a700] py-2.5 text-sm font-bold text-white transition hover:bg-[#f5a700]/90 disabled:opacity-60"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {token ? "Ganti Password" : "Kirim Link Reset"}
      </button>
      <Link href="/admin/login" className="block text-center text-xs font-semibold text-[#9a6a00] hover:text-[#242423]">
        Kembali ke login
      </Link>
    </form>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfaf7] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5a700]/10">
            <KeyRound size={20} className="text-[#f5a700]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#242423]">Reset Password</h1>
          <p className="mt-1 text-sm text-[#242423]/50">Teman UMKM Kita CMS</p>
        </div>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
