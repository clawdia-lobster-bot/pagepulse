"use client";
import { useState } from "react";
import Link from "next/link";

export default function RestorePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null);

  async function handleRestore(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.customer_id) {
        localStorage.setItem("pp_customer_id", data.customer_id);
        localStorage.setItem("pp_pro", "true");
        setResult({ success: true, message: "Pro access restored! Redirecting..." });
        setTimeout(() => (window.location.href = "/"), 2000);
      } else {
        setResult({ success: false, message: data.error || "No active subscription found for this email." });
      }
    } catch {
      setResult({ success: false, message: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-6 text-center">
      <div className="card p-12 max-w-lg w-full">
        <div className="text-5xl mb-6">🔑</div>
        <h1 className="text-3xl font-bold text-white mb-3">Restore Pro Access</h1>
        <p className="text-slate-400 mb-8">
          Enter the email you used at checkout and we&apos;ll restore your Pro subscription.
        </p>

        <form onSubmit={handleRestore} className="space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
                <span className="spinner" /> Checking...
              </span>
            ) : (
              "Restore Access"
            )}
          </button>
        </form>

        {result && (
          <div className={`mt-6 p-4 rounded-xl border text-sm ${
            result.success
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            {result.message}
          </div>
        )}

        <p className="text-sm text-slate-500 mt-8">
          Don&apos;t have a subscription?{" "}
          <Link href="/pricing" className="text-blue-400 hover:underline">
            Get Pro →
          </Link>
        </p>
      </div>
    </div>
  );
}
