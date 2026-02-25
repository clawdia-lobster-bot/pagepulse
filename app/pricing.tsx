import React from "react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: 0,
    freq: "/mo",
    features: [
      "1 audit per day",
      "SEO report",
      "Basic recommendations",
      "Email support",
    ],
    cta: "Get Started",
    ctaLink: "/",
    highlight: false,
  },
  {
    name: "Pro",
    price: 19,
    freq: "/mo",
    features: [
      "Unlimited audits",
      "Advanced SEO report",
      "Pro recommendations",
      "Priority support",
      "Access upcoming features",
    ],
    cta: "Upgrade to Pro",
    ctaLink: "/checkout?plan=pro",
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-6 text-black dark:text-white">Pricing</h1>
      <div className="flex flex-col sm:flex-row gap-8 w-full max-w-3xl justify-center">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={
              `flex flex-col border rounded-xl shadow-md px-8 py-8 items-center bg-white dark:bg-zinc-900 w-full sm:w-1/2 ` +
              (plan.highlight ? "border-blue-500 shadow-lg scale-105" : "border-zinc-200 dark:border-zinc-700")
            }
          >
            <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">{plan.name}</h2>
            <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">{plan.price ? `$${plan.price}` : "Free"}</span>
            <span className="text-zinc-500 mb-6">{plan.freq}</span>
            <ul className="mb-6 space-y-2 text-zinc-600 dark:text-zinc-300 text-left">
              {plan.features.map((feature, idx) => (
                <li key={idx}>• {feature}</li>
              ))}
            </ul>
            <Link href={plan.ctaLink} legacyBehavior>
              <a className={`px-6 py-3 rounded-xl font-semibold transition text-white ` + (plan.highlight ? "bg-blue-600 hover:bg-blue-700" : "bg-zinc-600 hover:bg-zinc-700")}>{plan.cta}</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
