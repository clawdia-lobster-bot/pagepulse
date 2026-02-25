import { NextRequest, NextResponse } from "next/server";

async function fetchPage(url: string) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "PagePulse SEO Bot" } });
    if (!res.ok) return null;
    const html = await res.text();
    return html;
  } catch (e) {
    return null;
  }
}

function analyzeSEO(html: string, url: string) {
  // Basic DOM analysis
  // (In production: use a robust HTML parser, sanitize untrusted input)
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
        if (desc) {
          report.metaDescription = desc[1];
        }
      }
      if (/property=['"]og:[^'"]*['"]/i.test(tag[0])) {
        const property = tag[0].match(/property=['"](og:[^'"]*)['"]/i);
        const content = tag[0].match(/content=['"]([^'"]*)['"]/i);
        if (property && content) {
          report.ogTags[property[1]] = content[1];
        }
      }
      if (/name=['"][^'"]*['"]/.test(tag[0])) {
        const name = tag[0].match(/name=['"]([^'"]*)['"]/i);
        const content = tag[0].match(/content=['"]([^'"]*)['"]/i);
        if (name && content) {
          report.metaTags.push({ name: name[1], content: content[1] });
        }
      }
      if (/name=['"]viewport['"]/i.test(tag[0])) {
        const viewport = tag[0].match(/content=['"]([^'"]*)['"]/i);
        if (viewport) report.viewport = viewport[1];
      }
    }
    // Canonical
    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    report.canonical = canonicalMatch ? canonicalMatch[1] : null;
    // Headings
    for (let i = 1; i <= 6; i++) {
      const regex = new RegExp(`<h${i}[^>]*>(.*?)<\/h${i}>`, 'gi');
      report.headings[`h${i}`] = [...html.matchAll(regex)].map(m => m[1]);
      if (i === 1) report.h1 = report.headings[`h1`];
    }
    // Image alt tags
    const imgMatches = html.matchAll(/<img[^>]*>/gi);
    for (const tag of imgMatches) {
      const alt = tag[0].match(/alt=['"]([^'"]*)['"]/i);
      const src = tag[0].match(/src=['"]([^'"]*)['"]/i);
      report.imgAlts.push({ alt: alt ? alt[1] : null, src: src ? src[1] : null });
    }
    // Scoring & recommendations
    let score = 100;
    if (!report.title) {
      score -= 15;
      report.recommendations.push("Missing <title> tag");
    }
    if (!report.metaDescription) {
      score -= 10;
      report.recommendations.push("Missing meta description");
    }
    if (!report.viewport) {
      score -= 5;
      report.recommendations.push("Missing mobile viewport meta tag");
    }
    if (!report.canonical) {
      score -= 5;
      report.recommendations.push("Missing canonical link tag");
    }
    if (report.h1.length === 0) {
      score -= 10;
      report.recommendations.push("No <h1> detected");
    }
    if (report.imgAlts.some((img: { alt: string | null; src: string | null }) => img.alt === null || img.alt === "")) {
      score -= 5;
      report.recommendations.push("Some images missing alt text");
    }
    report.auditScore = Math.max(0, score);
  } catch (e) {
    report.error = "Error during analysis";
    report.auditScore = 0;
  }
  return report;
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  const html = await fetchPage(url);
  if (!html) {
    return NextResponse.json({ error: "Unable to fetch page" }, { status: 422 });
  }
  const report = analyzeSEO(html, url);
  return NextResponse.json(report);
}
