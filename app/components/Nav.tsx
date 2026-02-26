"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function Nav() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user?.email ?? null;
      if (!active) return;
      setUserEmail(email);

      if (email) {
        try {
          const res = await fetch("/api/subscription");
          const result = await res.json();
          if (!active) return;
          setIsPro(!!result.active);
        } catch {
          if (!active) return;
          setIsPro(false);
        }
      } else {
        setIsPro(false);
      }
    }

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email ?? null;
      setUserEmail(email);
      if (email) {
        loadSession();
      } else {
        setIsPro(false);
      }
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handlePortal() {
    try {
      const res = await fetch("/api/portal");
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Portal error:", err);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUserEmail(null);
    setIsPro(false);
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
        {userEmail ? (
          <>
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
              <Link
                href="/pricing"
                className="text-sm font-medium bg-blue-600/10 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600/20 transition border border-blue-500/20"
              >
                Get Pro
              </Link>
            )}
            <span className="text-sm text-slate-400 hidden md:inline">
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-400 hover:text-white transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition">
              Login
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-blue-600/10 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600/20 transition border border-blue-500/20">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
