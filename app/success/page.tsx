"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "verified" | "error">("loading");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }

    // Verify session and store customer info
    fetch(`/api/subscription?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.active && data.customer_id) {
          localStorage.setItem("pp_customer_id", data.customer_id);
          localStorage.setItem("pp_pro", "true");
          setStatus("verified");
        } else if (data.customer_id) {
          // Subscription might not be active yet but we have the customer
          localStorage.setItem("pp_customer_id", data.customer_id);
          localStorage.setItem("pp_pro", "true");
          setStatus("verified");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-6 text-center">
        <div className="card p-12 max-w-lg">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <h1 className="text-2xl font-bold text-white">Verifying your subscription...</h1>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-6 text-center">
        <div className="card p-12 max-w-lg">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
          <p className="text-slate-400 mb-8">We couldn&apos;t verify your subscription. If you were charged, please contact support.</p>
          <Link href="/" className="btn-glow inline-block px-8 py-3 rounded-xl text-white font-semibold">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-6 text-center">
      <div className="card p-12 max-w-lg">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-3">You&apos;re on Pro!</h1>
        <p className="text-slate-400 mb-8">
          Welcome aboard. You now have unlimited audits, AI-generated fix code, and enhanced reports.
        </p>
        <Link href="/" className="btn-glow inline-block px-8 py-3 rounded-xl text-white font-semibold">
          Run Your First Pro Audit →
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-6 text-center">
        <div className="card p-12 max-w-lg">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <h1 className="text-2xl font-bold text-white">Loading...</h1>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
