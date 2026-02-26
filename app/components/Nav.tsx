"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Nav() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const proFlag = localStorage.getItem("pp_pro");
    const customerId = localStorage.getItem("pp_customer_id");
    if (proFlag === "true" && customerId) {
      setIsPro(true);
    }
  }, []);

  async function handlePortal() {
    const customerId = localStorage.getItem("pp_customer_id");
    if (!customerId) return;
    try {
      const res = await fetch(`/api/portal?customer_id=${customerId}`);
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Portal error:", err);
    }
  }

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
          P
        </div>
        <span className="text-xl font-bold text-white tracking-tight">
          Page<span className="text-blue-400">Pulse</span>
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/pricing" className="text-sm font-medium text-slate-400 hover:text-white transition">
          Pricing
        </Link>
        {isPro ? (
          <>
            <button
              onClick={handlePortal}
              className="text-sm font-medium text-slate-400 hover:text-white transition"
            >
              Manage Subscription
            </button>
            <span className="text-sm font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-lg">
              ⚡ Pro
            </span>
          </>
        ) : (
          <>
            <Link href="/restore" className="text-sm font-medium text-slate-400 hover:text-white transition">
              Restore Pro
            </Link>
            <Link href="/pricing" className="text-sm font-medium bg-blue-600/10 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600/20 transition border border-blue-500/20">
              Get Pro
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
