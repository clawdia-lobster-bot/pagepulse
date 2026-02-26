"use client";
import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function LoginPage() {
  return <Suspense><LoginContent /></Suspense>;
}

function LoginContent() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";
  const verified = searchParams.get("verified") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push(nextPath);
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-6 text-center">
      <div className="card p-12 max-w-lg w-full">
        <div className="text-5xl mb-6">🔐</div>
        <h1 className="text-3xl font-bold text-white mb-3">Welcome back</h1>
        <p className="text-slate-400 mb-8">
          Log in to unlock Pro audits, AI fixes, and subscription management.
        </p>

        {verified && (
          <div className="mb-6 p-4 rounded-xl border border-green-500/20 bg-green-500/10 text-green-400 text-sm">
            Email verified. You can log in now.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-4 rounded-xl bg-[#0a1628] border border-white/10 text-white placeholder-slate-500 text-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition"
          />
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-5 py-4 rounded-xl bg-[#0a1628] border border-white/10 text-white placeholder-slate-500 text-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-glow w-full py-4 rounded-xl text-white font-semibold text-lg disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner" /> Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
            {message}
          </div>
        )}

        <p className="text-sm text-slate-500 mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}
