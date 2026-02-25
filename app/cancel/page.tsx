import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-6 text-center">
      <div className="card p-12 max-w-lg">
        <div className="text-6xl mb-6">🤔</div>
        <h1 className="text-3xl font-bold text-white mb-3">Changed your mind?</h1>
        <p className="text-slate-400 mb-8">
          No worries. You can still use our free tier — 1 audit per day, no strings attached.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-glow px-8 py-3 rounded-xl text-white font-semibold">
            Try a Free Audit
          </Link>
          <Link href="/pricing" className="px-8 py-3 rounded-xl text-white font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition">
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
