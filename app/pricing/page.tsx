"use client";
import Link from "next/link";

const faqs = [
  {
    q: "What exactly do I get with Pro?",
    a: "Unlimited audits, AI-generated code fixes for every issue, weekly automated email reports, historical score tracking, competitor SEO comparison, and Core Web Vitals monitoring. Everything you need to rank higher.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — cancel in one click from your Stripe dashboard. No contracts, no cancellation fees. If you cancel within 7 days, we'll refund you fully.",
  },
  {
    q: "How are the AI fix suggestions different from the free recommendations?",
    a: "Free gives you 'Missing meta description.' Pro gives you the actual HTML meta tag with optimized copy you can paste directly into your code. It's the difference between knowing the problem and having the solution.",
  },
  {
    q: "How accurate is the audit?",
    a: "We check the same factors Google's own Lighthouse audits check — title tags, meta descriptions, headings, image alt text, Open Graph, canonical URLs, viewport, and more. Pro adds Core Web Vitals (LCP, FID, CLS).",
  },
];

export default function PricingPage() {
  async function handleCheckout() {
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col items-center px-6 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          One plan. Everything you need.
        </h1>
        <p className="text-lg text-slate-400 max-w-lg mx-auto">
          Start free, upgrade when you&apos;re ready to stop guessing and start ranking.
        </p>
      </div>

      {/* Plans */}
      <div className="flex flex-col sm:flex-row gap-6 max-w-3xl w-full mb-16">
        {/* Free */}
        <div className="card flex-1 p-8 flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Free</h2>
            <p className="text-slate-400 text-sm mt-1">Quick one-off checks</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-black text-white">$0</span>
            <span className="text-slate-400 ml-1">forever</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {["1 audit per day", "7 basic SEO checks", "Score + recommendations"].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 bg-white/5 text-slate-400">✓</span>
                <span className="text-slate-300">{f}</span>
              </li>
            ))}
            {["AI fix code", "Weekly reports", "Competitor tracking", "Score history"].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 bg-white/5 text-slate-600">✗</span>
                <span className="text-slate-500">{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/"
            className="w-full py-3 rounded-xl text-white font-semibold text-center bg-white/5 border border-white/10 hover:bg-white/10 transition block"
          >
            Start Free Audit
          </Link>
        </div>

        {/* Pro */}
        <div className="card card-highlight flex-1 p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            BEST VALUE
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Pro</h2>
            <p className="text-slate-400 text-sm mt-1">For anyone serious about ranking</p>
          </div>
          <div className="mb-2">
            <span className="text-4xl font-black text-white">$19</span>
            <span className="text-slate-400 ml-1">/month</span>
          </div>
          <p className="text-xs text-slate-500 mb-6">Less than $0.63/day — cheaper than a coffee</p>
          <ul className="space-y-3 mb-8 flex-1">
            {[
              "Unlimited audits",
              "AI-generated fix code (copy-paste ready)",
              "Weekly automated email reports",
              "Score history & trend charts",
              "Competitor SEO comparison",
              "Core Web Vitals (LCP, FID, CLS)",
              "Priority support",
              "API access",
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 bg-blue-500/20 text-blue-400">✓</span>
                <span className="text-slate-300">{f}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleCheckout}
            className="btn-glow w-full py-3 rounded-xl text-white font-semibold text-center"
          >
            Get Pro — $19/mo →
          </button>
          <p className="text-xs text-slate-500 text-center mt-3">7-day money-back guarantee · Cancel anytime</p>
        </div>
      </div>

      {/* What Pro users get */}
      <div className="max-w-3xl w-full mb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">What Pro actually does for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5">
            <div className="text-xl mb-2">🤖</div>
            <h3 className="font-bold text-white text-sm mb-1">AI Fix Code</h3>
            <p className="text-slate-400 text-xs">Don&apos;t just know what&apos;s wrong — get the exact HTML, meta tags, and schema markup to fix it. Copy, paste, deploy.</p>
          </div>
          <div className="card p-5">
            <div className="text-xl mb-2">📧</div>
            <h3 className="font-bold text-white text-sm mb-1">Weekly Reports</h3>
            <p className="text-slate-400 text-xs">Every Monday, get a full audit emailed to you with changes highlighted. Catch regressions before Google does.</p>
          </div>
          <div className="card p-5">
            <div className="text-xl mb-2">📈</div>
            <h3 className="font-bold text-white text-sm mb-1">Score Trends</h3>
            <p className="text-slate-400 text-xs">See your SEO score over time. Know whether your changes are actually working or just feel like they are.</p>
          </div>
          <div className="card p-5">
            <div className="text-xl mb-2">🔎</div>
            <h3 className="font-bold text-white text-sm mb-1">Competitor Intel</h3>
            <p className="text-slate-400 text-xs">Compare your SEO against your top competitors. See exactly where they&apos;re beating you and what to prioritize.</p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-2xl w-full mb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Questions? We got you.</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="card p-5">
              <h3 className="font-semibold text-white text-sm mb-2">{faq.q}</h3>
              <p className="text-slate-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center mb-8">
        <p className="text-slate-400 mb-4">Still on the fence?</p>
        <Link href="/" className="text-blue-400 hover:underline text-sm">
          ← Run a free audit first and see what you&apos;re missing
        </Link>
      </div>

      <p className="text-sm text-slate-500">
        Secure checkout via Stripe · Cancel anytime · No hidden fees
      </p>
      <p className="text-sm text-slate-500 mt-4">
        Already a subscriber?{" "}
        <Link href="/restore" className="text-blue-400 hover:underline">
          Restore access →
        </Link>
      </p>
    </div>
  );
}
