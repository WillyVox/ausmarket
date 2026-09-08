import type {
  MarketDataProvider,
  Quote,
  IndexQuote,
  ForexRate,
  CryptoQuote,
  Fundamentals,
  NewsItem,
} from "./provider";

// IMPORTANT: this provider exists only to make the UI renderable
// during development. It must never be used in production, and it
// never reports status "LIVE" — that would misrepresent sample data
// as real-time. Swap this out via getMarketDataProvider() below once
// a licensed feed is configured.

const now = () => new Date().toISOString();

export class MockMarketDataProvider implements MarketDataProvider {
  async getQuote(symbol: string): Promise<Quote | null> {
    return {
      value: 42.13,
      change: 0.34,
      changePct: 0.81,
      volume: 1_204_500,
      timestamp: now(),
      source: "mock-provider (development only)",
      market: "ASX",
      asset: symbol.toUpperCase(),
      status: "UNAVAILABLE",
    };
  }

  async getHistoricalPrices(): Promise<{ t: string; v: number }[]> {
    return [];
  }

  async getIndex(symbol: string): Promise<IndexQuote | null> {
    return {
      name: symbol.toUpperCase() === "XJO" ? "ASX 200" : symbol.toUpperCase(),
      value: 8000,
      change: 12.4,
      changePct: 0.15,
      timestamp: now(),
      source: "mock-provider (development only)",
      market: "ASX",
      asset: symbol.toUpperCase(),
      status: "UNAVAILABLE",
    };
  }

  async getForexRate(pair: string): Promise<ForexRate | null> {
    return {
      bid: 0.652,
      ask: 0.6522,
      high: 0.656,
      low: 0.648,
      change: -0.002,
      timestamp: now(),
      source: "mock-provider (development only)",
      market: "FOREX",
      asset: pair.toUpperCase(),
      status: "UNAVAILABLE",
    };
  }

  async getCryptoPrice(symbol: string): Promise<CryptoQuote | null> {
    return {
      priceUsd: 65000,
      priceAud: 99500,
      change24h: 1.2,
      timestamp: now(),
      source: "mock-provider (development only)",
      market: "CRYPTO",
      asset: symbol.toUpperCase(),
      status: "UNAVAILABLE",
    };
  }

  async getFundamentals(symbol: string): Promise<Fundamentals | null> {
    return { symbol: symbol.toUpperCase() };
  }

  async getNews(): Promise<NewsItem[]> {
    return [];
  }
}

let cached: MarketDataProvider | null = null;

export function getMarketDataProvider(): MarketDataProvider {
  if (cached) return cached;
  // Future: branch on env.MARKET_DATA_PROVIDER to select a real
  // implementation (licensed ASX feed, Twelve Data, CoinGecko, etc).
  cached = new MockMarketDataProvider();
  return cached;
}
