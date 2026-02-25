"use client";
import { useState } from "react";
import Link from "next/link";

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "score-green" : score >= 50 ? "score-yellow" : "score-red";
  const bg = score >= 80 ? "score-bg-green" : score >= 50 ? "score-bg-yellow" : "score-bg-red";
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${bg}`}>
      <span className={`text-3xl font-black ${color}`}>{score}</span>
      <span className="text-slate-400 text-sm">/100</span>
    </div>
  );
}

function CheckCard({ name, passed, message }: { name: string; passed: boolean; message: string }) {
  return (
    <div className="card p-4 flex items-start gap-3">
      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
        {passed ? "✓" : "✗"}
      </div>
      <div>
        <div className="font-semibold text-white text-sm">{name}</div>
        <div className="text-slate-400 text-sm mt-0.5">{message}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [auditUrl, setAuditUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAudit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setReport(null);
    setError(null);
    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: auditUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setReport(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Free SEO audits — no signup required
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight max-w-4xl mb-6">
          Your site&apos;s SEO health,{" "}
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            on autopilot
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          Get an instant SEO audit with actionable fixes. Upgrade to Pro for weekly automated reports and AI-powered recommendations.
        </p>

        {/* Audit Form */}
        <form onSubmit={handleAudit} className="w-full max-w-xl mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              placeholder="Enter your website URL..."
              value={auditUrl}
              onChange={e => setAuditUrl(e.target.value)}
              required
              className="flex-1 px-5 py-4 rounded-xl bg-[#111d33] border border-white/10 text-white placeholder-slate-500 text-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-glow px-8 py-4 rounded-xl text-white font-semibold text-lg whitespace-nowrap disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner" /> Auditing...
                </span>
              ) : (
                "Run Free Audit"
              )}
            </button>
          </div>
        </form>

        <p className="text-sm text-slate-500">
          No signup needed · Results in seconds · <Link href="/pricing" className="text-blue-400 hover:underline">See Pro features →</Link>
        </p>
      </section>

      {/* Error */}
      {error && (
        <div className="max-w-2xl mx-auto px-6 pb-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-center">
            {error}
          </div>
        </div>
      )}

      {/* Report */}
      {report && (
        <section className="max-w-3xl mx-auto px-6 pb-20 w-full">
          <div className="card p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">SEO Audit Report</h2>
                <p className="text-slate-400 text-sm">{auditUrl}</p>
              </div>
              <ScoreBadge score={report.auditScore} />
            </div>

            {/* Checks grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <CheckCard name="Title Tag" passed={!!report.title} message={report.title || "Missing — add a <title> tag"} />
              <CheckCard name="Meta Description" passed={!!report.metaDescription} message={report.metaDescription ? report.metaDescription.substring(0, 80) + "..." : "Missing — add a meta description"} />
              <CheckCard name="H1 Heading" passed={report.h1 && report.h1.length > 0} message={report.h1?.length ? report.h1[0] : "No H1 found"} />
              <CheckCard name="Viewport Meta" passed={!!report.viewport} message={report.viewport || "Missing — needed for mobile"} />
              <CheckCard name="Canonical URL" passed={!!report.canonical} message={report.canonical || "Missing — helps avoid duplicate content"} />
              <CheckCard name="Open Graph" passed={Object.keys(report.ogTags || {}).length > 0} message={Object.keys(report.ogTags || {}).length > 0 ? `${Object.keys(report.ogTags).length} OG tags found` : "Missing — links won't look good on social"} />
              <CheckCard name="Image Alt Text" passed={!(report.imgAlts || []).some((img: any) => !img.alt)} message={(report.imgAlts || []).some((img: any) => !img.alt) ? `${(report.imgAlts || []).filter((img: any) => !img.alt).length} images missing alt text` : "All images have alt text"} />
            </div>

            {/* Recommendations */}
            {report.recommendations && report.recommendations.length > 0 && (
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
                <h3 className="font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <span>⚡</span> Recommendations
                </h3>
                <ul className="space-y-2">
                  {report.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">→</span> {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8 text-center p-6 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <p className="text-white font-semibold mb-2">Want weekly automated audits + AI fix suggestions?</p>
              <Link href="/pricing" className="btn-glow inline-block px-6 py-3 rounded-xl text-white font-semibold">
                Upgrade to Pro — $19/mo
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features (shown when no report) */}
      {!report && !loading && (
        <section className="max-w-5xl mx-auto px-6 pb-20 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 text-center">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-bold text-white mb-2">Instant Audits</h3>
              <p className="text-slate-400 text-sm">Get a complete SEO health check in seconds. No signup, no friction.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-white mb-2">Weekly Reports</h3>
              <p className="text-slate-400 text-sm">Pro users get automated weekly audits delivered straight to their inbox.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-bold text-white mb-2">AI Fix Suggestions</h3>
              <p className="text-slate-400 text-sm">Not just problems — actionable code snippets and copy to fix them.</p>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} PagePulse · <Link href="/pricing" className="hover:text-slate-300 transition">Pricing</Link>
        </p>
      </footer>
    </div>
  );
}
