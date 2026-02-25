import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-6 text-center">
      <div className="card p-12 max-w-lg">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-3">You&apos;re on Pro!</h1>
        <p className="text-slate-400 mb-8">
          Welcome aboard. You now have unlimited audits, weekly reports, and AI-powered fix suggestions.
        </p>
        <Link href="/" className="btn-glow inline-block px-8 py-3 rounded-xl text-white font-semibold">
          Run Your First Pro Audit →
        </Link>
      </div>
    </div>
  );
}
