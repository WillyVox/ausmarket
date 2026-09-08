import type {
  MarketDataProvider,
  Quote,
  IndexQuote,
  ForexRate,
  CryptoQuote,
  Fundamentals,
  NewsItem,
} from "./provider";
import { MockMarketDataProvider } from "./mock-provider";
import { fetchCoinGeckoQuote, isCoinGeckoSupported } from "./coingecko-provider";

// Delegates each method to whichever backing provider actually has a
// real implementation for it. This is the seam every future
// integration (a licensed ASX feed, a forex feed) plugs into — one
// method moves from "mock" to "real" at a time, without touching any
// page component.
export class CompositeMarketDataProvider implements MarketDataProvider {
  constructor(private readonly fallback: MarketDataProvider) {}

  async getQuote(symbol: string): Promise<Quote | null> {
    return this.fallback.getQuote(symbol);
  }

  async getHistoricalPrices(symbol: string, range: string) {
    return this.fallback.getHistoricalPrices(symbol, range);
  }

  async getIndex(symbol: string): Promise<IndexQuote | null> {
    return this.fallback.getIndex(symbol);
  }

  async getForexRate(pair: string): Promise<ForexRate | null> {
    return this.fallback.getForexRate(pair);
  }

  async getCryptoPrice(symbol: string): Promise<CryptoQuote | null> {
    if (isCoinGeckoSupported(symbol)) {
      const live = await fetchCoinGeckoQuote(symbol);
      if (live) return live;
      // CoinGecko down/rate-limited — fall back rather than showing
      // nothing, but the fallback still reports status UNAVAILABLE.
    }
    return this.fallback.getCryptoPrice(symbol);
  }

  async getFundamentals(symbol: string): Promise<Fundamentals | null> {
    return this.fallback.getFundamentals(symbol);
  }

  async getNews(params?: { symbol?: string; category?: string; limit?: number }): Promise<NewsItem[]> {
    return this.fallback.getNews(params);
  }
}

let cached: MarketDataProvider | null = null;

export function getMarketDataProvider(): MarketDataProvider {
  if (cached) return cached;
  cached = new CompositeMarketDataProvider(new MockMarketDataProvider());
  return cached;
}
