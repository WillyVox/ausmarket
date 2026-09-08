// Provider abstraction. No component should ever call a specific
// vendor SDK directly — everything goes through this interface so
// swapping/adding a licensed feed later doesn't touch UI code.

export type DataStatus = "LIVE" | "DELAYED" | "STALE" | "UNAVAILABLE";

export interface MarketDataPoint {
  value: number;
  timestamp: string; // ISO
  source: string;
  market: string; // e.g. "ASX", "FOREX", "CRYPTO"
  asset: string; // symbol
  status: DataStatus;
}

export interface Quote extends MarketDataPoint {
  change: number;
  changePct: number;
  volume?: number;
}

export interface IndexQuote extends Quote {
  name: string;
}

export interface ForexRate extends MarketDataPoint {
  bid: number;
  ask: number;
  high: number;
  low: number;
  change: number;
}

export interface CryptoQuote extends MarketDataPoint {
  priceUsd: number;
  priceAud: number;
  change24h: number;
  volume24h?: number;
  marketCap?: number;
}

export interface NewsItem {
  headline: string;
  slug: string;
  summary: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: string;
  symbols: string[];
}

export interface Fundamentals {
  symbol: string;
  marketCap?: number;
  peRatio?: number;
  eps?: number;
  dividendYield?: number;
  week52High?: number;
  week52Low?: number;
  avgVolume?: number;
}

export interface MarketDataProvider {
  getQuote(symbol: string): Promise<Quote | null>;
  getHistoricalPrices(symbol: string, range: string): Promise<{ t: string; v: number }[]>;
  getIndex(symbol: string): Promise<IndexQuote | null>;
  getForexRate(pair: string): Promise<ForexRate | null>;
  getCryptoPrice(symbol: string): Promise<CryptoQuote | null>;
  getFundamentals(symbol: string): Promise<Fundamentals | null>;
  getNews(params?: { symbol?: string; category?: string; limit?: number }): Promise<NewsItem[]>;
}
