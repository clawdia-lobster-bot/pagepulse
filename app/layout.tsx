import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Link from "next/link";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: "PagePulse — Stop losing traffic to SEO mistakes",
  description: "Free instant SEO audits in seconds. Find and fix the issues killing your Google rankings. Pro users get AI-generated code fixes, weekly reports, and competitor tracking.",
  openGraph: {
    title: "PagePulse — Stop losing traffic to SEO mistakes",
    description: "Free instant SEO audits in seconds. Find and fix the issues killing your Google rankings.",
    url: "https://pagepulse-tawny.vercel.app",
    siteName: "PagePulse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PagePulse — Free SEO Audits in Seconds",
    description: "Find the SEO issues killing your Google rankings. Free instant audit, no signup required.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body className="bg-grid min-h-screen">
        {/* Nav */}
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
            <Link href="/pricing" className="text-sm font-medium bg-blue-600/10 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600/20 transition border border-blue-500/20">
              Get Pro
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
