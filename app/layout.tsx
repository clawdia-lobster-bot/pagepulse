import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PagePulse — Your site's SEO health, on autopilot",
  description: "Automated SEO audits with AI-powered fix suggestions. Free instant audits, weekly reports, and actionable insights.",
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
