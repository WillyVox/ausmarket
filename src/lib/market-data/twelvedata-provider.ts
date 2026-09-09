import type { Quote, PricePoint } from "./provider";

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

// Free tier is 800 req/day, 8/min — so we ask for daily candles for
// every range except the two shortest, where an intraday interval is
// actually meaningful. outputsize is capped well under the free
// tier's per-symbol ceiling.
function rangeToParams(range: string): { interval: string; outputsize: number } {
  switch (range) {
    case "1D":
      return { interval: "5min", outputsize: 80 }; // ~ one ASX trading day
    case "5D":
      return { interval: "30min", outputsize: 65 };
    case "1M":
      return { interval: "1day", outputsize: 22 }; // trading days in a month
    case "3M":
      return { interval: "1day", outputsize: 65 };
    case "6M":
      return { interval: "1day", outputsize: 130 };
    case "YTD": {
      const now = new Date();
      const jan1 = Date.UTC(now.getUTCFullYear(), 0, 1);
      const calendarDays = Math.max(1, Math.ceil((now.getTime() - jan1) / 86_400_000));
      return { interval: "1day", outputsize: Math.min(260, Math.ceil(calendarDays * 0.7)) };
    }
    case "1Y":
      return { interval: "1day", outputsize: 260 };
    case "5Y":
      return { interval: "1week", outputsize: 260 };
    case "MAX":
      return { interval: "1month", outputsize: 240 };
    default:
      return { interval: "1day", outputsize: 22 };
  }
}

interface TwelveDataTimeSeriesResponse {
  values?: { datetime: string; close: string }[];
  status?: string;
  message?: string;
}

export async function fetchTwelveDataHistory(symbol: string, range: string): Promise<PricePoint[]> {
  if (!isTwelveDataConfigured()) return [];

  const { interval, outputsize } = rangeToParams(range);
  const url = new URL("https://api.twelvedata.com/time_series");
  url.searchParams.set("symbol", symbol.toUpperCase());
  url.searchParams.set("exchange", "ASX");
  url.searchParams.set("interval", interval);
  url.searchParams.set("outputsize", String(outputsize));
  url.searchParams.set("apikey", getApiKey() as string);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) {
      console.error(`[twelvedata] history ${res.status} for ${symbol}`);
      return [];
    }

    const data = (await res.json()) as TwelveDataTimeSeriesResponse;
    if (data.status === "error" || !data.values) {
      console.error(`[twelvedata] history error for ${symbol}: ${data.message ?? "unknown"}`);
      return [];
    }

    return data.values
      .map((v) => ({ t: new Date(v.datetime).toISOString(), v: parseFloat(v.close) }))
      .filter((p) => !Number.isNaN(p.v))
      .sort((a, b) => a.t.localeCompare(b.t));
  } catch (err) {
    console.error(`[twelvedata] history fetch failed for ${symbol}`, err);
    return [];
  }
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