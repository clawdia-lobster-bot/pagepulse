import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Nav from "./components/Nav";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();

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
        <Nav />
        {children}
      </body>
    </html>
  );
}
