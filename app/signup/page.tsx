"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function SignupPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setSuccess(false);

    const redirectTo = `${window.location.origin}/login?verified=1`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-6 text-center">
      <div className="card p-12 max-w-lg w-full">
        <div className="text-5xl mb-6">✨</div>
        <h1 className="text-3xl font-bold text-white mb-3">Create your account</h1>
        <p className="text-slate-400 mb-8">
          Start with free audits and upgrade to Pro whenever you&apos;re ready.
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-5 py-4 rounded-xl bg-[#0a1628] border border-white/10 text-white placeholder-slate-500 text-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-glow w-full py-4 rounded-xl text-white font-semibold text-lg disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner" /> Creating account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {success && (
          <div className="mt-6 p-4 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300 text-sm">
            Check your email to verify your account, then log in.
          </div>
        )}

        {message && (
          <div className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
            {message}
          </div>
        )}

        <p className="text-sm text-slate-500 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Log in →
          </Link>
        </p>
      </div>
    </div>
  );
}
