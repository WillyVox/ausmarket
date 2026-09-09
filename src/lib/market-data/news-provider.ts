import type { NewsItem } from "./provider";

// Real, keyless news ingestion via Google News RSS search. There's no
// free, keyless Australian market-news API with a stable schema, but
// Google News RSS is public, requires no key, and — critically for
// the copyright stance this project takes — only ever gives us a
// headline + a link back to the original publisher, never full
// article text. We render exactly that: headline, one-line summary
// derived from the headline itself, and an outbound link. We never
// fetch or reproduce the linked article's body.
//
// Fails closed: any network error, bad status, or unparseable XML
// returns []. The /news page already renders an empty state for that
// case rather than erroring.
//
// Not exercised against a live request in this environment (no
// network access here) — the RSS item shape below matches Google
// News' documented format as of last verification, but treat this as
// worth a smoke test once deployed, same caveat as the Twelve Data
// provider.

function buildFeedUrl(params?: { symbol?: string; category?: string }): string {
  const query = params?.symbol
    ? `${params.symbol} ASX shares`
    : params?.category
      ? `${params.category} Australia`
      : "ASX OR \"Australian share market\" OR ASX200";

  const url = new URL("https://news.google.com/rss/search");
  url.searchParams.set("q", query);
  url.searchParams.set("hl", "en-AU");
  url.searchParams.set("gl", "AU");
  url.searchParams.set("ceid", "AU:en");
  return url.toString();
}

function decodeEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .trim();
}

function extractTag(block: string, tag: string): string | null {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match && match[1] !== undefined ? decodeEntities(match[1]) : null;
}

function extractSourceName(block: string): string | null {
  const match = block.match(/<source[^>]*>([\s\S]*?)<\/source>/i);
  return match && match[1] !== undefined ? decodeEntities(match[1]) : null;
}

function slugify(headline: string): string {
  return headline
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

// Google News RSS titles are typically "Headline - Publisher Name".
// Strip that suffix so the displayed headline doesn't duplicate the
// source line we render separately.
function stripSourceSuffix(title: string, source: string | null): string {
  if (!source) return title;
  const suffix = ` - ${source}`;
  return title.endsWith(suffix) ? title.slice(0, -suffix.length) : title;
}

export async function fetchGoogleNewsRss(params?: {
  symbol?: string;
  category?: string;
  limit?: number;
}): Promise<NewsItem[]> {
  const url = buildFeedUrl(params);

  try {
    const res = await fetch(url, {
      // News moves fast but this is a screen-scrape-adjacent feed —
      // 10 minutes keeps us well clear of any rate limiting.
      next: { revalidate: 600 },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AusMarketBot/1.0)" },
    });
    if (!res.ok) {
      console.error(`[google-news-rss] ${res.status} for query`);
      return [];
    }

    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    const limit = params?.limit ?? 10;

    const parsed: NewsItem[] = items.slice(0, limit).map((block) => {
      const rawTitle = extractTag(block, "title") ?? "Untitled";
      const source = extractSourceName(block);
      const headline = stripSourceSuffix(rawTitle, source);
      const link = extractTag(block, "link") ?? "";
      const pubDate = extractTag(block, "pubDate");

      return {
        headline,
        slug: slugify(headline),
        summary: headline, // Google News RSS descriptions are HTML link
        // wrappers, not prose summaries — the headline itself is the
        // only text we're confident isn't reproducing the article.
        source: source ?? "Google News",
        sourceUrl: link,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        category: params?.category ?? "markets",
        symbols: params?.symbol ? [params.symbol.toUpperCase()] : [],
      };
    });

    return parsed.filter((item) => item.sourceUrl);
  } catch (err) {
    console.error("[google-news-rss] fetch failed", err);
    return [];
  }
}