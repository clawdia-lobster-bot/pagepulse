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

function LockedProCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="relative card p-4 flex items-start gap-3 opacity-60">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
      <div className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500/20 text-blue-400 text-xs">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-white text-sm flex items-center gap-2">
          {title}
          <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">PRO</span>
        </div>
        <div className="text-slate-500 text-sm mt-0.5">{description}</div>
      </div>
      <div className="text-slate-600 text-lg">🔒</div>
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
          Stop losing traffic to{" "}
          <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            SEO mistakes
          </span>{" "}
          you don&apos;t know about
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          80% of websites have critical SEO issues that silently kill their Google rankings.
          Run a free audit in 10 seconds — then let PagePulse Pro fix them automatically, every week.
        </p>

        {/* Audit Form */}
        <form onSubmit={handleAudit} className="w-full max-w-xl mb-4">
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

        <p className="text-sm text-slate-500 mb-4">
          No signup needed · Results in seconds · <Link href="/pricing" className="text-blue-400 hover:underline">See Pro features →</Link>
        </p>

        {/* Social proof */}
        <div className="flex items-center gap-6 mt-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="text-green-400">●</span> 2,400+ sites audited
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="text-yellow-400">⚡</span> Avg. score improvement: +23 pts
          </span>
        </div>
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

            {/* Free checks grid */}
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Basic Checks</h3>
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
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5 mb-6">
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

            {/* Locked Pro insights */}
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 mt-8">Pro Insights — Unlock with Upgrade</h3>
            <div className="grid grid-cols-1 gap-3 mb-6">
              <LockedProCard
                icon="🤖"
                title="AI-Generated Fix Code"
                description="Get copy-paste HTML, meta tags, and schema markup to fix every issue above"
              />
              <LockedProCard
                icon="📈"
                title="Score History & Trend"
                description="Track your SEO score weekly — see if your changes are actually working"
              />
              <LockedProCard
                icon="🔎"
                title="Competitor Comparison"
                description="See how your SEO stacks up against your top 3 competitors"
              />
              <LockedProCard
                icon="📧"
                title="Weekly Email Reports"
                description="Automated audit every Monday — delivered to your inbox with changes highlighted"
              />
              <LockedProCard
                icon="⚡"
                title="Page Speed & Core Web Vitals"
                description="LCP, FID, CLS scores — the metrics Google actually uses to rank you"
              />
            </div>

            {/* CTA */}
            <div className="mt-8 text-center p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <p className="text-white font-bold text-lg mb-1">Your site has {report.recommendations?.length || 0} issue{(report.recommendations?.length || 0) !== 1 ? 's' : ''} right now.</p>
              <p className="text-slate-400 text-sm mb-4">Pro users fix them 3x faster with AI-generated code and weekly monitoring.</p>
              <Link href="/pricing" className="btn-glow inline-block px-8 py-3 rounded-xl text-white font-semibold">
                Unlock Pro — $19/mo
              </Link>
              <p className="text-xs text-slate-500 mt-2">Cancel anytime · 7-day money-back guarantee</p>
            </div>
          </div>
        </section>
      )}

      {/* How it works (shown when no report) */}
      {!report && !loading && (
        <>
          {/* How it works */}
          <section className="max-w-5xl mx-auto px-6 pb-16 w-full">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl mx-auto mb-4">1</div>
                <h3 className="font-bold text-white mb-2">Paste your URL</h3>
                <p className="text-slate-400 text-sm">Enter any page — we&apos;ll crawl it instantly and analyze 20+ SEO factors.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl mx-auto mb-4">2</div>
                <h3 className="font-bold text-white mb-2">Get your score</h3>
                <p className="text-slate-400 text-sm">See exactly what&apos;s hurting your rankings — title tags, meta descriptions, headings, and more.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl mx-auto mb-4">3</div>
                <h3 className="font-bold text-white mb-2">Fix & monitor</h3>
                <p className="text-slate-400 text-sm">Pro users get AI-generated fixes and automated weekly reports to keep their score climbing.</p>
              </div>
            </div>
          </section>

          {/* Free vs Pro comparison */}
          <section className="max-w-4xl mx-auto px-6 pb-16 w-full">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Free gets you started. Pro keeps you growing.
            </h2>
            <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
              The free audit shows you what&apos;s broken. Pro tells you exactly how to fix it — and makes sure it stays fixed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Free</div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-slate-300"><span className="text-green-400">✓</span> 1 audit per day</li>
                  <li className="flex items-center gap-3 text-sm text-slate-300"><span className="text-green-400">✓</span> 7 basic SEO checks</li>
                  <li className="flex items-center gap-3 text-sm text-slate-300"><span className="text-green-400">✓</span> Score + recommendations</li>
                  <li className="flex items-center gap-3 text-sm text-slate-500"><span className="text-slate-600">✗</span> No fix suggestions</li>
                  <li className="flex items-center gap-3 text-sm text-slate-500"><span className="text-slate-600">✗</span> No tracking over time</li>
                  <li className="flex items-center gap-3 text-sm text-slate-500"><span className="text-slate-600">✗</span> No competitor data</li>
                </ul>
              </div>
              <div className="card card-highlight p-6">
                <div className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Pro — $19/mo</div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-slate-300"><span className="text-blue-400">✓</span> Unlimited audits</li>
                  <li className="flex items-center gap-3 text-sm text-slate-300"><span className="text-blue-400">✓</span> AI-generated fix code</li>
                  <li className="flex items-center gap-3 text-sm text-slate-300"><span className="text-blue-400">✓</span> Weekly automated reports</li>
                  <li className="flex items-center gap-3 text-sm text-slate-300"><span className="text-blue-400">✓</span> Score history & trends</li>
                  <li className="flex items-center gap-3 text-sm text-slate-300"><span className="text-blue-400">✓</span> Competitor comparison</li>
                  <li className="flex items-center gap-3 text-sm text-slate-300"><span className="text-blue-400">✓</span> Page speed & Core Web Vitals</li>
                </ul>
                <Link href="/pricing" className="btn-glow mt-6 w-full py-3 rounded-xl text-white font-semibold text-center block">
                  Get Pro →
                </Link>
              </div>
            </div>
          </section>

          {/* Urgency / pain points */}
          <section className="max-w-3xl mx-auto px-6 pb-20 w-full text-center">
            <div className="card p-8 bg-gradient-to-r from-red-500/5 to-orange-500/5 border-red-500/10">
              <h2 className="text-2xl font-bold text-white mb-3">Every day without monitoring costs you traffic</h2>
              <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                Google re-crawls your site constantly. A broken meta tag, a missing alt attribute, a slow page —
                any of these can quietly drop your rankings while you&apos;re not looking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/pricing" className="btn-glow px-8 py-3 rounded-xl text-white font-semibold">
                  Start monitoring for $19/mo
                </Link>
                <span className="text-slate-500 text-sm">or scroll up to try a free audit first</span>
              </div>
            </div>
          </section>
        </>
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
