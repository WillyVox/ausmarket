import type { CryptoQuote } from "./provider";

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
