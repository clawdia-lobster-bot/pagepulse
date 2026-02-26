import { NextRequest, NextResponse } from "next/server";

async function fetchPage(url: string) {
  try {
    const start = Date.now();
    const res = await fetch(url, { headers: { "User-Agent": "PagePulse SEO Bot" } });
    const fetchTimeMs = Date.now() - start;
    if (!res.ok) return null;
    const html = await res.text();
    return { html, fetchTimeMs };
  } catch (e) {
    return null;
  }
}

function generateFixCode(issue: string, report: any, url: string): string {
  switch (issue) {
    case "Missing <title> tag":
      const domain = new URL(url).hostname.replace("www.", "");
      return `<title>${domain} — Your Page Title | Brand Name</title>`;
    case "Missing meta description":
      return `<meta name="description" content="Add a compelling 150-160 character description of your page content here. Include your primary keyword naturally." />`;
    case "Missing mobile viewport meta tag":
      return `<meta name="viewport" content="width=device-width, initial-scale=1" />`;
    case "Missing canonical link tag":
      return `<link rel="canonical" href="${url}" />`;
    case "No <h1> detected":
      return `<h1>Your Primary Page Heading with Target Keyword</h1>`;
    case "Some images missing alt text": {
      const missing = (report.imgAlts || []).filter((img: any) => !img.alt);
      return missing
        .slice(0, 5)
        .map((img: any) => `<img src="${img.src || "..."}" alt="Descriptive text about this image" />`)
        .join("\n");
    }
    default:
      return "";
  }
}

function generateOGFixCode(url: string, report: any): string {
  const lines = [];
  if (!report.ogTags["og:title"]) lines.push(`<meta property="og:title" content="${report.title || "Your Page Title"}" />`);
  if (!report.ogTags["og:description"]) lines.push(`<meta property="og:description" content="${report.metaDescription || "A compelling description of your page"}" />`);
  if (!report.ogTags["og:url"]) lines.push(`<meta property="og:url" content="${url}" />`);
  if (!report.ogTags["og:type"]) lines.push(`<meta property="og:type" content="website" />`);
  if (!report.ogTags["og:image"]) lines.push(`<meta property="og:image" content="https://yourdomain.com/og-image.jpg" />`);
  return lines.join("\n");
}

function analyzeSEO(html: string, url: string, isPro: boolean, fetchTimeMs: number) {
  const report: any = {
    title: null,
    metaDescription: null,
    metaTags: [],
    h1: [],
    headings: {},
    imgAlts: [],
    canonical: null,
    ogTags: {},
    viewport: null,
    auditScore: 100,
    recommendations: [],
  };

  try {
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    report.title = titleMatch ? titleMatch[1] : null;

    const metaMatches = html.matchAll(/<meta[^>]*>/gi);
    for (const tag of metaMatches) {
      if (/name=['"]description['"]/i.test(tag[0]) || /property=['"]og:description['"]/i.test(tag[0])) {
        const desc = tag[0].match(/content=['"]([^'"]*)['"]/i);
        if (desc) report.metaDescription = desc[1];
      }
      if (/property=['"]og:[^'"]*['"]/i.test(tag[0])) {
        const property = tag[0].match(/property=['"](og:[^'"]*)['"]/i);
        const content = tag[0].match(/content=['"]([^'"]*)['"]/i);
        if (property && content) report.ogTags[property[1]] = content[1];
      }
      if (/name=['"][^'"]*['"]/.test(tag[0])) {
        const name = tag[0].match(/name=['"]([^'"]*)['"]/i);
        const content = tag[0].match(/content=['"]([^'"]*)['"]/i);
        if (name && content) report.metaTags.push({ name: name[1], content: content[1] });
      }
      if (/name=['"]viewport['"]/i.test(tag[0])) {
        const viewport = tag[0].match(/content=['"]([^'"]*)['"]/i);
        if (viewport) report.viewport = viewport[1];
      }
    }

    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    report.canonical = canonicalMatch ? canonicalMatch[1] : null;

    for (let i = 1; i <= 6; i++) {
      const regex = new RegExp(`<h${i}[^>]*>(.*?)<\/h${i}>`, "gi");
      report.headings[`h${i}`] = [...html.matchAll(regex)].map((m) => m[1]);
      if (i === 1) report.h1 = report.headings[`h1`];
    }

    const imgMatches = html.matchAll(/<img[^>]*>/gi);
    for (const tag of imgMatches) {
      const alt = tag[0].match(/alt=['"]([^'"]*)['"]/i);
      const src = tag[0].match(/src=['"]([^'"]*)['"]/i);
      report.imgAlts.push({ alt: alt ? alt[1] : null, src: src ? src[1] : null });
    }

    // Scoring & recommendations
    let score = 100;
    if (!report.title) { score -= 15; report.recommendations.push("Missing <title> tag"); }
    if (!report.metaDescription) { score -= 10; report.recommendations.push("Missing meta description"); }
    if (!report.viewport) { score -= 5; report.recommendations.push("Missing mobile viewport meta tag"); }
    if (!report.canonical) { score -= 5; report.recommendations.push("Missing canonical link tag"); }
    if (report.h1.length === 0) { score -= 10; report.recommendations.push("No <h1> detected"); }
    if (report.imgAlts.some((img: any) => img.alt === null || img.alt === "")) {
      score -= 5;
      report.recommendations.push("Some images missing alt text");
    }
    report.auditScore = Math.max(0, score);

    // PRO features
    if (isPro) {
      // Fix code for each recommendation
      report.fixCode = report.recommendations.map((rec: string) => ({
        issue: rec,
        code: generateFixCode(rec, report, url),
      }));

      // OG tag fixes if incomplete
      const ogKeys = Object.keys(report.ogTags);
      const requiredOG = ["og:title", "og:description", "og:url", "og:type", "og:image"];
      const missingOG = requiredOG.filter((k) => !ogKeys.includes(k));
      if (missingOG.length > 0) {
        report.fixCode.push({
          issue: `Missing Open Graph tags: ${missingOG.join(", ")}`,
          code: generateOGFixCode(url, report),
        });
      }

      // Enhanced checks
      report.proAnalysis = {
        fetchTimeMs,
        loadRating: fetchTimeMs < 1000 ? "Fast" : fetchTimeMs < 3000 ? "Average" : "Slow",
        wordCount: html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(" ").length,
        internalLinks: 0,
        externalLinks: 0,
        hasStructuredData: false,
      };

      // Count links
      const linkMatches = html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi);
      const parsedUrl = new URL(url);
      for (const m of linkMatches) {
        try {
          const linkUrl = new URL(m[1], url);
          if (linkUrl.hostname === parsedUrl.hostname) {
            report.proAnalysis.internalLinks++;
          } else {
            report.proAnalysis.externalLinks++;
          }
        } catch {
          // relative or malformed
          report.proAnalysis.internalLinks++;
        }
      }

      // Structured data detection
      report.proAnalysis.hasStructuredData =
        /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
    }
  } catch (e) {
    report.error = "Error during analysis";
    report.auditScore = 0;
  }
  return report;
}

export async function POST(req: NextRequest) {
  const { url, pro } = await req.json();
  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  const result = await fetchPage(url);
  if (!result) {
    return NextResponse.json({ error: "Unable to fetch page" }, { status: 422 });
  }
  const report = analyzeSEO(result.html, url, !!pro, result.fetchTimeMs);
  return NextResponse.json(report);
}
