import type { Quote } from "./provider";

// Real, live-ish implementation for ASX stock quotes via Twelve Data
// (https://twelvedata.com). Unlike CoinGecko/Frankfurter, this one
// needs an API key — ASX quote data isn't available keyless anywhere
// reputable, and Twelve Data's free tier (800 requests/day, 8/min) is
// the most workable option for development/low traffic.
//
// IMPORTANT — read before enabling in production:
// This is a stopgap for development, NOT the licensed ASX feed the
// spec calls for (see docs/compliance-flags.md, item 2). Twelve
// Data's own terms govern redistribution — confirm your plan permits
// displaying this data publicly at whatever traffic level you expect
// before relying on it beyond local testing.
//
// Symbol convention assumed here: bare ASX ticker (e.g. "BHP"), with
// exchange disambiguated via the `exchange=ASX` query param. If your
// Twelve Data plan/account uses a different convention, adjust
// buildQuoteUrl() — this hasn't been exercised against a live account
// in this environment (no network access here to verify).
//
// Fails closed: missing key, network error, bad status, or an
// unexpected response shape all return null. Never fabricates a quote.

interface TwelveDataQuoteResponse {
  symbol?: string;
  close?: string;
  previous_close?: string;
  change?: string;
  percent_change?: string;
  volume?: string;
  datetime?: string;
  is_market_open?: boolean;
  status?: string; // Twelve Data puts "error" here on failure
  message?: string;
}

function getApiKey(): string | null {
  return process.env.TWELVE_DATA_API_KEY || null;
}

function buildQuoteUrl(symbol: string): string {
  const url = new URL("https://api.twelvedata.com/quote");
  url.searchParams.set("symbol", symbol.toUpperCase());
  url.searchParams.set("exchange", "ASX");
  url.searchParams.set("apikey", getApiKey() as string);
  return url.toString();
}

export function isTwelveDataConfigured(): boolean {
  return getApiKey() !== null;
}

export async function fetchTwelveDataQuote(symbol: string): Promise<Quote | null> {
  if (!isTwelveDataConfigured()) return null;

  try {
    const res = await fetch(buildQuoteUrl(symbol), {
      // Free-tier data updates infrequently; revalidate every 60s to
      // stay well under the 8-req/min limit even with several
      // concurrent page views.
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      // console.error(`[twelvedata] ${res.status} for ${symbol}`);
      return null;
    }

    const data = (await res.json()) as TwelveDataQuoteResponse;

    if (data.status === "error" || !data.close) {
      // console.error(`[twelvedata] error response for ${symbol}: ${data.message ?? "unknown"}`);
      return null;
    }

    const value = parseFloat(data.close);
    const change = parseFloat(data.change ?? "0");
    const changePct = parseFloat(data.percent_change ?? "0");
    const volume = data.volume ? parseFloat(data.volume) : undefined;

    if (Number.isNaN(value)) return null;

    return {
      value,
      change: Number.isNaN(change) ? 0 : change,
      changePct: Number.isNaN(changePct) ? 0 : changePct,
      volume,
      timestamp: data.datetime ? new Date(data.datetime).toISOString() : new Date().toISOString(),
      source: "Twelve Data",
      market: "ASX",
      asset: symbol.toUpperCase(),
      // Free tier is not real-time — label accordingly rather than
      // trusting is_market_open to mean "this price is live".
      status: "DELAYED",
    };
  } catch (err) {
    // console.error(`[twelvedata] fetch failed for ${symbol}`, err);
    return null;
  }
}
