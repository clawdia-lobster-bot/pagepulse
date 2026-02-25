"use client";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for quick checks",
    features: [
      "1 audit per day",
      "Basic SEO report",
      "Score + recommendations",
      "7 key checks",
    ],
    cta: "Start Free Audit",
    ctaLink: "/",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious site owners",
    features: [
      "Unlimited audits",
      "Weekly automated reports",
      "AI-powered fix suggestions",
      "Competitor keyword tracking",
      "Priority support",
      "API access",
    ],
    cta: "Get Pro",
    ctaLink: "/api/checkout",
    highlight: true,
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
    <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Simple, honest pricing
        </h1>
        <p className="text-lg text-slate-400 max-w-lg mx-auto">
          Start free. Upgrade when your site deserves it.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 max-w-3xl w-full">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card flex-1 p-8 flex flex-col ${plan.highlight ? "card-highlight" : ""}`}
          >
            <div className="mb-6">
              {plan.highlight && (
                <span className="inline-block text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-3">
                  Most Popular
                </span>
              )}
              <h2 className="text-xl font-bold text-white">{plan.name}</h2>
              <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-black text-white">{plan.price}</span>
              <span className="text-slate-400 ml-1">{plan.period}</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${plan.highlight ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-slate-400"}`}>
                    ✓
                  </span>
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            {plan.highlight ? (
              <button
                onClick={handleCheckout}
                className="btn-glow w-full py-3 rounded-xl text-white font-semibold text-center"
              >
                {plan.cta}
              </button>
            ) : (
              <Link
                href={plan.ctaLink}
                className="w-full py-3 rounded-xl text-white font-semibold text-center bg-white/5 border border-white/10 hover:bg-white/10 transition block"
              >
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-500 mt-8">
        Cancel anytime · No hidden fees · Secure checkout via Stripe
      </p>
    </div>
  );
}
