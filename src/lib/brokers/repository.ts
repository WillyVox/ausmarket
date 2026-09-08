import { prisma } from "@/lib/db/prisma";
import { isAllowlistedAffiliateUrl } from "@/lib/affiliate/config";
import {
  BROKER_SEEDS,
  EXCHANGE_SEEDS,
  type ComparisonCategory,
} from "@/lib/brokers/static-data";
import { verifiedLabel, formatMinimumDeposit } from "@/lib/brokers/format";

export { verifiedLabel };

// This is the ONLY module allowed to query the Broker/Exchange/
// AffiliateClick tables directly (per the header note in
// prisma/schema.prisma). Every page imports from here, never from
// @/lib/db/prisma or @prisma/client directly.
//
// Fail-open pattern, matching src/lib/market-data: if the database is
// unreachable, or reachable but empty (not yet seeded), fall back to
// the bundled static content rather than rendering an empty/broken
// page. If the database IS reachable and genuinely has no row for a
// given slug, that's a real 404 — we don't paper over it with a
// fallback the production database was never meant to have.

export type DataSource = "database" | "static-fallback";

export interface BrokerRecord {
  slug: string;
  name: string;
  category: string[];
  description: string;
  country: string;
  products: string[];
  markets: string[];
  feesSummary: string;
  minimumDeposit: string; // pre-formatted for display, e.g. "Not verified" or "$500"
  mobileApp: boolean;
  demoAccount: boolean;
  platformFeatures: string[];
  pros: string[];
  considerations: string[];
  regulatoryInformation: string;
  websiteUrl: string;
  affiliateSlug: string | null;
  sources: { label: string; url: string }[];
  lastVerifiedAt: string | null; // ISO date or null; format with verifiedLabel() at render time
}

export interface ExchangeRecord {
  slug: string;
  name: string;
  description: string;
  country: string;
  productsSupported: string[];
  feesSummary: string;
  regulatoryInformation: string;
  websiteUrl: string;
  affiliateSlug: string | null;
  sources: { label: string; url: string }[];
  lastVerifiedAt: string | null;
}

// ---------- mapping helpers ----------

function mapDbBroker(row: {
  slug: string;
  name: string;
  category: string[];
  description: string;
  country: string;
  products: string[];
  markets: string[];
  feesSummary: string;
  minimumDeposit: unknown; // Prisma.Decimal | null
  mobileApp: boolean;
  demoAccount: boolean;
  platformFeatures: string[];
  pros: string[];
  considerations: string[];
  regulatoryInformation: string;
  websiteUrl: string;
  affiliateSlug: string | null;
  sources: unknown;
  lastVerifiedAt: Date | null;
}): BrokerRecord {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    country: row.country,
    products: row.products,
    markets: row.markets,
    feesSummary: row.feesSummary,
    minimumDeposit: formatMinimumDeposit(
      row.minimumDeposit === null || row.minimumDeposit === undefined
        ? null
        : Number(row.minimumDeposit)
    ),
    mobileApp: row.mobileApp,
    demoAccount: row.demoAccount,
    platformFeatures: row.platformFeatures,
    pros: row.pros,
    considerations: row.considerations,
    regulatoryInformation: row.regulatoryInformation,
    websiteUrl: row.websiteUrl,
    affiliateSlug: row.affiliateSlug,
    sources: (row.sources as { label: string; url: string }[]) ?? [],
    lastVerifiedAt: row.lastVerifiedAt ? row.lastVerifiedAt.toISOString().slice(0, 10) : null,
  };
}

function mapSeedBroker(seed: (typeof BROKER_SEEDS)[number]): BrokerRecord {
  return {
    slug: seed.slug,
    name: seed.name,
    category: seed.category,
    description: seed.description,
    country: seed.country,
    products: seed.products,
    markets: seed.markets,
    feesSummary: seed.feesSummary,
    minimumDeposit: formatMinimumDeposit(seed.minimumDepositAmount),
    mobileApp: seed.mobileApp,
    demoAccount: seed.demoAccount,
    platformFeatures: seed.platformFeatures,
    pros: seed.pros,
    considerations: seed.considerations,
    regulatoryInformation: seed.regulatoryInformation,
    websiteUrl: seed.websiteUrl,
    affiliateSlug: seed.affiliateSlug,
    sources: seed.sources,
    lastVerifiedAt: seed.lastVerifiedAt,
  };
}

function mapDbExchange(row: {
  slug: string;
  name: string;
  description: string;
  country: string;
  productsSupported: string[];
  feesSummary: string;
  regulatoryInformation: string;
  websiteUrl: string;
  affiliateSlug: string | null;
  sources: unknown;
  lastVerifiedAt: Date | null;
}): ExchangeRecord {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    country: row.country,
    productsSupported: row.productsSupported,
    feesSummary: row.feesSummary,
    regulatoryInformation: row.regulatoryInformation,
    websiteUrl: row.websiteUrl,
    affiliateSlug: row.affiliateSlug,
    sources: (row.sources as { label: string; url: string }[]) ?? [],
    lastVerifiedAt: row.lastVerifiedAt ? row.lastVerifiedAt.toISOString().slice(0, 10) : null,
  };
}

function mapSeedExchange(seed: (typeof EXCHANGE_SEEDS)[number]): ExchangeRecord {
  return {
    slug: seed.slug,
    name: seed.name,
    description: seed.description,
    country: seed.country,
    productsSupported: seed.productsSupported,
    feesSummary: seed.feesSummary,
    regulatoryInformation: seed.regulatoryInformation,
    websiteUrl: seed.websiteUrl,
    affiliateSlug: seed.affiliateSlug,
    sources: seed.sources,
    lastVerifiedAt: seed.lastVerifiedAt,
  };
}

// ---------- list + lookup ----------

export async function getBrokersWithSource(): Promise<{
  source: DataSource;
  brokers: BrokerRecord[];
}> {
  try {
    const rows = await prisma.broker.findMany({ orderBy: { name: "asc" } });
    if (rows.length > 0) {
      return { source: "database", brokers: rows.map(mapDbBroker) };
    }
    console.warn("[brokers/repository] Broker table is empty — has `npm run db:seed` been run? Falling back to static content.");
  } catch (err) {
    console.error("[brokers/repository] Database unreachable, falling back to static broker content:", err);
  }
  return { source: "static-fallback", brokers: BROKER_SEEDS.map(mapSeedBroker) };
}

export async function getExchangesWithSource(): Promise<{
  source: DataSource;
  exchanges: ExchangeRecord[];
}> {
  try {
    const rows = await prisma.exchange.findMany({ orderBy: { name: "asc" } });
    if (rows.length > 0) {
      return { source: "database", exchanges: rows.map(mapDbExchange) };
    }
    console.warn("[brokers/repository] Exchange table is empty — has `npm run db:seed` been run? Falling back to static content.");
  } catch (err) {
    console.error("[brokers/repository] Database unreachable, falling back to static exchange content:", err);
  }
  return { source: "static-fallback", exchanges: EXCHANGE_SEEDS.map(mapSeedExchange) };
}

export async function getBrokers(): Promise<BrokerRecord[]> {
  return (await getBrokersWithSource()).brokers;
}

export async function getExchanges(): Promise<ExchangeRecord[]> {
  return (await getExchangesWithSource()).exchanges;
}

export async function getBrokerBySlug(slug: string): Promise<BrokerRecord | null> {
    console.log("slug in getBrokerBySlug ---------", slug);
  try {
    console.log("await prisma ---------", await prisma);
    const row = await prisma.broker?.findUnique({ where: { slug } });
    if (row) return mapDbBroker(row);
    // Reachable DB genuinely has no such broker — check whether the
    // table has been seeded at all before deciding this is a real 404.
    const count = await prisma.broker.count();
    if (count > 0) return null; // seeded DB, real 404
    console.warn(`[brokers/repository] Broker table is empty — checking static fallback for "${slug}".`);
  } catch (err) {
    console.error(`[brokers/repository] Database unreachable looking up broker "${slug}", falling back:`, err);
  }
  const seed = BROKER_SEEDS.find((b) => b.slug === slug);
  return seed ? mapSeedBroker(seed) : null;
}

export async function getExchangeBySlug(slug: string): Promise<ExchangeRecord | null> {
  try {
    const row = await prisma.exchange.findUnique({ where: { slug } });
    if (row) return mapDbExchange(row);
    const count = await prisma.exchange.count();
    if (count > 0) return null;
    console.warn(`[brokers/repository] Exchange table is empty — checking static fallback for "${slug}".`);
  } catch (err) {
    console.error(`[brokers/repository] Database unreachable looking up exchange "${slug}", falling back:`, err);
  }
  const seed = EXCHANGE_SEEDS.find((e) => e.slug === slug);
  return seed ? mapSeedExchange(seed) : null;
}

export async function getBrokersByCategory(category: ComparisonCategory): Promise<BrokerRecord[]> {
  const brokers = await getBrokers();
  return brokers.filter((b) => b.category.includes(category));
}

// ---------- affiliate redirect + click tracking ----------

export interface AffiliateTarget {
  partnerType: "broker" | "exchange";
  partnerSlug: string;
  websiteUrl: string;
}

// Resolves a /go/[slug] path segment to a redirect target. Checks
// brokers, then exchanges. Returns null if no active partner matches
// the slug — the route handler treats that as "don't redirect".
export async function resolveAffiliateTarget(affiliateSlug: string): Promise<AffiliateTarget | null> {
  const brokers = await getBrokers();
  const broker = brokers.find((b) => b.affiliateSlug === affiliateSlug);
  if (broker) {
    return { partnerType: "broker", partnerSlug: broker.slug, websiteUrl: broker.websiteUrl };
  }

  const exchanges = await getExchanges();
  const exchange = exchanges.find((e) => e.affiliateSlug === affiliateSlug);
  if (exchange) {
    return { partnerType: "exchange", partnerSlug: exchange.slug, websiteUrl: exchange.websiteUrl };
  }

  return null;
}

export interface RecordClickParams {
  partnerType: "broker" | "exchange";
  partnerSlug: string;
  landingPage: string;
  placement: string | null;
  campaign: string | null;
  referrer: string | null;
  deviceType?: string | null;
  country?: string | null;
  sessionId?: string | null;
}

// Fire-and-forget: never throws, and callers should never `await`
// this in a way that blocks the redirect response — see
// src/app/go/[partner]/route.ts, which calls it without awaiting.
export async function recordAffiliateClick(params: RecordClickParams): Promise<void> {
  try {
    await prisma.affiliateClick.create({
      data: {
        partnerType: params.partnerType,
        partnerSlug: params.partnerSlug,
        landingPage: params.landingPage,
        placement: params.placement ?? "unknown",
        campaign: params.campaign,
        referrer: params.referrer,
        deviceType: params.deviceType ?? null,
        country: params.country ?? null,
        sessionId: params.sessionId ?? null,
      },
    });
  } catch (err) {
    // Never let click-tracking failure break the affiliate redirect —
    // the user still needs to reach the provider.
    console.error("[brokers/repository] Failed to record affiliate click:", err);
  }
}

// ---------- methodology / transparency stats ----------

export interface MethodologyStats {
  dataSource: DataSource;
  totalBrokers: number;
  totalExchanges: number;
  verifiedBrokers: number; // lastVerifiedAt is set (not null)
  verifiedExchanges: number;
  brokersWithActiveAffiliateLink: number;
  exchangesWithActiveAffiliateLink: number;
  affiliateClicksLast30Days: number | null; // null if DB unreachable
  generatedAt: string; // ISO timestamp — this page is rendered dynamically, not cached stale
}

export async function getMethodologyStats(): Promise<MethodologyStats> {
  const [{ source: brokerSource, brokers }, { exchanges }] = await Promise.all([
    getBrokersWithSource(),
    getExchangesWithSource(),
  ]);

  let affiliateClicksLast30Days: number | null = null;
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    affiliateClicksLast30Days = await prisma.affiliateClick.count({
      where: { timestamp: { gte: thirtyDaysAgo } },
    });
  } catch {
    affiliateClicksLast30Days = null;
  }

  return {
    dataSource: brokerSource,
    totalBrokers: brokers.length,
    totalExchanges: exchanges.length,
    verifiedBrokers: brokers.filter((b) => b.lastVerifiedAt !== null).length,
    verifiedExchanges: exchanges.filter((e) => e.lastVerifiedAt !== null).length,
    brokersWithActiveAffiliateLink: brokers.filter(
      (b) => b.affiliateSlug !== null && isAllowlistedAffiliateUrl(b.websiteUrl)
    ).length,
    exchangesWithActiveAffiliateLink: exchanges.filter(
      (e) => e.affiliateSlug !== null && isAllowlistedAffiliateUrl(e.websiteUrl)
    ).length,
    affiliateClicksLast30Days,
    generatedAt: new Date().toISOString(),
  };
}