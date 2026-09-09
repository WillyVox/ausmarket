import type { CryptoQuote, PricePoint } from "./provider";

// Real, live implementation for crypto only — CoinGecko's public
// "simple price" endpoint is free and keyless, which makes it a safe
// first vertical to de-risk the provider-swap pattern before doing
// the same for a paid/licensed stocks or forex feed.
//
// Fails closed: any network error, bad status, or unexpected shape
// returns null rather than throwing or fabricating a number. Callers
// already handle `null` (see crypto pages), so a CoinGecko outage
// degrades to "—" / "unavailable", never a fake price.

const SYMBOL_TO_COINGECKO_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XRP: "ripple",
  BNB: "binancecoin",
};

interface CoinGeckoSimplePriceResponse {
  [id: string]: {
    usd?: number;
    aud?: number;
    usd_24h_change?: number;
    usd_market_cap?: number;
    usd_24h_vol?: number;
  };
}

export async function fetchCoinGeckoQuote(symbol: string): Promise<CryptoQuote | null> {
  const id = SYMBOL_TO_COINGECKO_ID[symbol.toUpperCase()];
  if (!id) return null;

  const url = new URL("https://api.coingecko.com/api/v3/simple/price");
  url.searchParams.set("ids", id);
  url.searchParams.set("vs_currencies", "usd,aud");
  url.searchParams.set("include_24hr_change", "true");
  url.searchParams.set("include_24hr_vol", "true");
  url.searchParams.set("include_market_cap", "true");

  try {
    const res = await fetch(url.toString(), {
      // Revalidate every 60s so we don't hammer the free tier /
      // hit rate limits, while still being reasonably fresh.
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`[coingecko] ${res.status} for ${symbol}`);
      return null;
    }

    const data = (await res.json()) as CoinGeckoSimplePriceResponse;
    const entry = data[id];
    if (!entry || entry.usd === undefined || entry.aud === undefined) {
      return null;
    }

    return {
      value: entry.usd,
      priceUsd: entry.usd,
      priceAud: entry.aud,
      change24h: entry.usd_24h_change ?? 0,
      volume24h: entry.usd_24h_vol,
      marketCap: entry.usd_market_cap,
      timestamp: new Date().toISOString(),
      source: "CoinGecko",
      market: "CRYPTO",
      asset: symbol.toUpperCase(),
      status: "DELAYED", // CoinGecko's free tier is not tick-level realtime
    };
  } catch (err) {
    console.error(`[coingecko] fetch failed for ${symbol}`, err);
    return null;
  }
}

export function isCoinGeckoSupported(symbol: string): boolean {
  return symbol.toUpperCase() in SYMBOL_TO_COINGECKO_ID;
}

// Maps our shared range vocabulary to CoinGecko's `days` param. CoinGecko's
// free public tier has, at various points, restricted `market_chart` to
// roughly the last 365 days — 5Y/MAX are requested anyway and simply return
// whatever the API is willing to give back (still real data, just possibly
// shorter than requested) rather than being blocked client-side. Not
// verified against a live account in this environment (no network access
// here) — worth a smoke test once deployed.
function rangeToDays(range: string): number {
  switch (range) {
    case "1D":
      return 1;
    case "5D":
      return 5;
    case "1M":
      return 30;
    case "3M":
      return 90;
    case "6M":
      return 180;
    case "YTD": {
      const now = new Date();
      const jan1 = Date.UTC(now.getUTCFullYear(), 0, 1);
      return Math.max(1, Math.ceil((now.getTime() - jan1) / 86_400_000));
    }
    case "1Y":
      return 365;
    case "5Y":
      return 1825;
    case "MAX":
      return 3650;
    default:
      return 30;
  }
}

interface CoinGeckoMarketChartResponse {
  prices?: [number, number][]; // [ms epoch, price in vs_currency]
}

export async function fetchCoinGeckoHistory(symbol: string, range: string): Promise<PricePoint[]> {
  const id = SYMBOL_TO_COINGECKO_ID[symbol.toUpperCase()];
  if (!id) return [];

  const days = rangeToDays(range);
  const url = new URL(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`);
  url.searchParams.set("vs_currency", "aud");
  url.searchParams.set("days", String(days));

  try {
    const res = await fetch(url.toString(), {
      // Daily candles don't need to be fetched more than hourly even
      // for the shortest ranges.
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`[coingecko] history ${res.status} for ${symbol}`);
      return [];
    }

    const data = (await res.json()) as CoinGeckoMarketChartResponse;
    if (!data.prices) return [];

    return data.prices.map(([ms, price]) => ({
      t: new Date(ms).toISOString(),
      v: price,
    }));
  } catch (err) {
    console.error(`[coingecko] history fetch failed for ${symbol}`, err);
    return [];
  }
}