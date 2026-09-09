import type {
  MarketDataProvider,
  Quote,
  IndexQuote,
  ForexRate,
  CryptoQuote,
  Fundamentals,
  NewsItem,
  PricePoint,
} from "./provider";
import { MockMarketDataProvider } from "./mock-provider";
import { fetchCoinGeckoQuote, fetchCoinGeckoHistory, isCoinGeckoSupported } from "./coingecko-provider"; // for live scrypto
import { fetchFrankfurterRate, fetchFrankfurterHistory, isFrankfurterSupported } from "./frankfurter-provider"; // for live forex
import { fetchTwelveDataQuote, fetchTwelveDataHistory, isTwelveDataConfigured } from "./twelvedata-provider"; // for live stock (ASC)
import { fetchGoogleNewsRss } from "./news-provider";

// Delegates each method to whichever backing provider actually has a
// real implementation for it. This is the seam every future
// integration (a licensed ASX feed, a forex feed) plugs into — one
// method moves from "mock" to "real" at a time, without touching any
// page component.
export class CompositeMarketDataProvider implements MarketDataProvider {
  constructor(private readonly fallback: MarketDataProvider) {}

  async getQuote(symbol: string): Promise<Quote | null> {
    if (isTwelveDataConfigured()) {
      const live = await fetchTwelveDataQuote(symbol);
      if (live) return live;
      // Key configured but request failed/rate-limited — fall back
      // rather than showing nothing.
    }
    return this.fallback.getQuote(symbol);
  }

  async getHistoricalPrices(
    symbol: string,
    range: string,
    market?: "STOCK" | "FOREX" | "CRYPTO"
  ): Promise<PricePoint[]> {
    if (market === "CRYPTO" && isCoinGeckoSupported(symbol)) {
      const live = await fetchCoinGeckoHistory(symbol, range);
      if (live.length > 0) return live;
    }
    if (market === "FOREX" && isFrankfurterSupported(symbol)) {
      const live = await fetchFrankfurterHistory(symbol, range);
      if (live.length > 0) return live;
    }
    if (market === "STOCK" && isTwelveDataConfigured()) {
      const live = await fetchTwelveDataHistory(symbol, range);
      if (live.length > 0) return live;
    }
    return this.fallback.getHistoricalPrices(symbol, range, market);
  }

  async getIndex(symbol: string): Promise<IndexQuote | null> {
    return this.fallback.getIndex(symbol);
  }

  async getForexRate(pair: string): Promise<ForexRate | null> {
    if (isFrankfurterSupported(pair)) {
      const live = await fetchFrankfurterRate(pair);
      if (live) return live;
      // Frankfurter down/unsupported pair — fall back, still labelled.
    }
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
    const live = await fetchGoogleNewsRss(params);
    if (live.length > 0) return live;
    return this.fallback.getNews(params);
  }
}

let cached: MarketDataProvider | null = null;

export function getMarketDataProvider(): MarketDataProvider {
  if (cached) return cached;
  cached = new CompositeMarketDataProvider(new MockMarketDataProvider());
  return cached;
}