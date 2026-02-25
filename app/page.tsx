"use client";
import { useState } from "react";

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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-6 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tighter text-black dark:text-zinc-50 mb-2">
            Your site's SEO health,<br className="hidden sm:block" /> on autopilot
          </h1>
          <p className="max-w-lg text-xl text-zinc-700 dark:text-zinc-300 mb-8">
            Automate your technical SEO audits and unlock actionable insights. Join the waitlist and get a free, instant SEO check-up for your site!
          </p>
          <form className="w-full flex flex-col sm:flex-row gap-3 items-stretch max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email for invite/waitlist"
              className="flex-1 border px-4 py-3 rounded-xl text-lg text-black dark:text-white bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-black/20"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition hover:bg-blue-700">
              Join Waitlist
            </button>
          </form>
          <form className="w-full max-w-md flex flex-col mt-8" onSubmit={handleAudit}>
            <input
              type="url"
              placeholder="Enter your website URL e.g. https://example.com"
              value={auditUrl}
              onChange={e => setAuditUrl(e.target.value)}
              className="flex-1 border px-4 py-3 rounded-xl text-lg text-black dark:text-white bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button type="submit" className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-3 rounded-xl font-semibold mt-3 transition hover:from-blue-600 hover:to-green-500" disabled={loading}>
              {loading ? "Running Audit..." : "Run Free SEO Audit"}
            </button>
          </form>
          {error && <div className="text-red-500 mt-4">{error}</div>}
          {report && (
            <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl mt-6 p-6 w-full max-w-xl text-left shadow-md">
              <h2 className="text-2xl font-bold mb-2 text-black dark:text-zinc-50">SEO Audit Report</h2>
              <div className="mb-2">
                <strong>Score:</strong> <span className="font-bold text-green-600 dark:text-green-400">{report.auditScore}/100</span>
                {report.recommendations && report.recommendations.length > 0 && (
                  <>
                    <br /><span className="text-red-500">Recommendations:</span>
                    <ul className="list-disc ml-6">
                      {report.recommendations.map((rec: string, i: number) => <li key={i}>{rec}</li>)}
                    </ul>
                  </>
                )}
              </div>
              <div><strong>Title:</strong> {report.title}</div>
              <div><strong>Meta description:</strong> {report.metaDescription}</div>
              <div><strong>H1s:</strong> {(report.h1 || []).join(", ")}</div>
              <div><strong>Canonical URL:</strong> {report.canonical}</div>
              <div><strong>Mobile viewport:</strong> {report.viewport}</div>
              <div className="my-2"><strong>Open Graph tags:</strong>
                <ul>
                  {report.ogTags && Object.entries(report.ogTags).map(([k, v]) => <li key={k}><strong>{k}:</strong> {v as string}</li>)}
                </ul>
              </div>
              <div className="my-2"><strong>Headings:</strong>
                <ul>
                  {report.headings && Object.entries(report.headings).map(([level, values]) => (
                    <li key={level}><strong>{level}:</strong> {(values as string[]).join(", ")}</li>
                  ))}
                </ul>
              </div>
              <div className="my-2"><strong>Images missing alt text:</strong>
                <ul>
                  {(report.imgAlts || [])
                    .filter((img: any) => !img.alt)
                    .map((img: any, i: number) => <li key={i}>{img.src}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
        <footer className="w-full pt-12 text-center text-sm text-zinc-400 dark:text-zinc-600">
          © {new Date().getFullYear()} PagePulse – Automated SEO Audit Tool
        </footer>
      </main>
    </div>
  );
}
