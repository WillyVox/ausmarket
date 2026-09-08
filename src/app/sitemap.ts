import type { MetadataRoute } from "next";
import { getBrokers, getExchanges } from "@/lib/brokers/repository";
import { POPULAR_STOCKS } from "@/lib/stocks/data";

// Static + programmatic routes. As real content sources (CMS articles,
// a full symbol database) come online in later phases, extend this
// with dynamic entries pulled from those sources rather than hardcoding
// them here — the shape stays the same.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ausmarket.example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/markets",
    "/markets/asx",
    "/markets/asx-200",
    "/markets/all-ordinaries",
    "/stocks",
    "/forex",
    "/crypto",
    "/news",
    "/calendar",
    "/compare",
    "/compare/brokers",
    "/compare/share-trading-platforms",
    "/compare/forex-platforms",
    "/compare/crypto-exchanges",
    "/learn",
    "/tools",
    "/tools/currency-converter",
    "/tools/compound-interest",
    "/tools/inflation-calculator",
    "/watchlist",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/affiliate-disclosure",
    "/cookie-policy",
    "/risk-warning",
    "/editorial-policy",
    "/methodology",
    "/how-we-make-money",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const stockRoutes = POPULAR_STOCKS.map((s) => ({
    url: `${SITE_URL}/stocks/${s.symbol.toLowerCase()}`,
    lastModified: new Date(),
  }));

  const [brokers, exchanges] = await Promise.all([getBrokers(), getExchanges()]);

  const brokerRoutes = brokers.map((b) => ({
    url: `${SITE_URL}/brokers/${b.slug}`,
    lastModified: new Date(),
  }));

  const exchangeRoutes = exchanges.map((e) => ({
    url: `${SITE_URL}/exchanges/${e.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...stockRoutes, ...brokerRoutes, ...exchangeRoutes];
}