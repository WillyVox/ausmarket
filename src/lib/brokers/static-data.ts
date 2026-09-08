// Fallback + seed content. Two consumers read this file:
//
// 1. prisma/seed.ts loads it into the database, unchanged — this is
//    the ONE-TIME source of truth for the initial Broker/Exchange
//    rows. After seeding, the database is the source of truth; this
//    file becomes a fallback only.
// 2. src/lib/brokers/repository.ts falls back to it when the database
//    is unreachable or not yet seeded, the same fail-open-to-a-
//    labelled-fallback pattern used by src/lib/market-data — so local
//    dev and this sandbox (no DATABASE_URL) still render real pages.
//
// LEGAL REVIEW REQUIRED before launch (see docs/compliance-flags.md
// item 7): every fee, feature, pro/consideration and regulatory
// description below is an illustrative placeholder, not verified
// current data. lastVerifiedAt is null everywhere on purpose — this
// must stay null until someone has actually checked each claim
// against the provider's current published terms.

export type ComparisonCategory = "share_trading" | "forex" | "crypto_exchange";

export interface BrokerSeed {
  slug: string;
  name: string;
  category: ComparisonCategory[];
  description: string;
  country: string;
  products: string[];
  markets: string[];
  feesSummary: string;
  minimumDepositAmount: number | null; // null = not verified, never fabricate a figure
  mobileApp: boolean;
  demoAccount: boolean;
  platformFeatures: string[];
  pros: string[];
  considerations: string[];
  regulatoryInformation: string;
  websiteUrl: string;
  affiliateSlug: string | null; // matches AFFILIATE_DOMAIN_ALLOWLIST entry via /go/[slug]
  sources: { label: string; url: string }[];
  lastVerifiedAt: string | null; // ISO date, or null for "Not verified"
}

export const BROKER_SEEDS: BrokerSeed[] = [
  {
    slug: "cmc-markets",
    name: "CMC Markets",
    category: ["share_trading", "forex"],
    description:
      "Australian-listed provider offering ASX and international share trading alongside a CFD and forex platform.",
    country: "Australia",
    products: ["ASX shares", "International shares", "CFDs", "Forex"],
    markets: ["ASX", "US", "UK", "Forex"],
    feesSummary: "Not verified — check provider for current brokerage schedule",
    minimumDepositAmount: null,
    mobileApp: true,
    demoAccount: true,
    platformFeatures: ["Advanced charting", "Research tools", "Demo account"],
    pros: ["Wide market access", "Established Australian provider"],
    considerations: ["CFD trading carries higher risk", "Fee schedule varies by account type"],
    regulatoryInformation: "Holds an Australian Financial Services Licence (AFSL) — verify current licence status directly with ASIC's register.",
    websiteUrl: "https://www.cmcmarkets.com/en-au/",
    affiliateSlug: "cmc-markets",
    sources: [{ label: "CMC Markets AU", url: "https://www.cmcmarkets.com/en-au/" }],
    lastVerifiedAt: null,
  },
  {
    slug: "commsec",
    name: "CommSec",
    category: ["share_trading"],
    description:
      "Share trading platform owned by the Commonwealth Bank of Australia, widely used by Australian retail investors.",
    country: "Australia",
    products: ["ASX shares", "International shares", "ETFs"],
    markets: ["ASX", "US"],
    feesSummary: "Not verified — check provider for current brokerage schedule",
    minimumDepositAmount: null,
    mobileApp: true,
    demoAccount: false,
    platformFeatures: ["Integration with CommBank accounts", "Research and analysis tools"],
    pros: ["Backed by a major Australian bank", "Familiar for existing CommBank customers"],
    considerations: ["Brokerage may be higher than newer low-cost platforms"],
    regulatoryInformation: "Operated by Commonwealth Securities Limited, an AFSL holder — verify current licence status directly with ASIC's register.",
    websiteUrl: "https://www.commsec.com.au/",
    affiliateSlug: "commsec",
    sources: [{ label: "CommSec", url: "https://www.commsec.com.au/" }],
    lastVerifiedAt: null,
  },
  {
    slug: "stake",
    name: "Stake",
    category: ["share_trading"],
    description:
      "Platform focused on ASX and US share trading aimed at self-directed retail investors.",
    country: "Australia",
    products: ["ASX shares", "US shares"],
    markets: ["ASX", "US"],
    feesSummary: "Not verified — check provider for current brokerage schedule",
    minimumDepositAmount: null,
    mobileApp: true,
    demoAccount: false,
    platformFeatures: ["US market access", "Mobile-first app"],
    pros: ["Simple US + ASX access from one account"],
    considerations: ["Fewer research tools than full-service platforms"],
    regulatoryInformation: "Australian entity holds an AFSL — verify current licence status directly with ASIC's register.",
    websiteUrl: "https://hellostake.com/",
    affiliateSlug: "stake",
    sources: [{ label: "Stake", url: "https://hellostake.com/" }],
    lastVerifiedAt: null,
  },
  {
    slug: "selfwealth",
    name: "Selfwealth",
    category: ["share_trading"],
    description:
      "ASX-focused broker known for flat-fee brokerage pricing on Australian trades.",
    country: "Australia",
    products: ["ASX shares", "International shares"],
    markets: ["ASX", "US", "select international"],
    feesSummary: "Not verified — historically flat-fee, check current schedule",
    minimumDepositAmount: null,
    mobileApp: true,
    demoAccount: false,
    platformFeatures: ["Flat-fee pricing model", "Community/social investing features"],
    pros: ["Predictable flat-fee brokerage on ASX trades"],
    considerations: ["Feature set lighter than full-service platforms"],
    regulatoryInformation: "Holds an AFSL — verify current licence status directly with ASIC's register.",
    websiteUrl: "https://www.selfwealth.com.au/",
    affiliateSlug: "selfwealth",
    sources: [{ label: "Selfwealth", url: "https://www.selfwealth.com.au/" }],
    lastVerifiedAt: null,
  },
  {
    slug: "pearler",
    name: "Pearler",
    category: ["share_trading"],
    description:
      "Australian platform aimed at long-term, buy-and-hold investors, with automated recurring investing tools.",
    country: "Australia",
    products: ["ASX shares", "ETFs", "US shares"],
    markets: ["ASX", "US"],
    feesSummary: "Not verified — check provider for current brokerage schedule",
    minimumDepositAmount: null,
    mobileApp: true,
    demoAccount: false,
    platformFeatures: ["Auto-invest / recurring orders", "Long-term investing focus"],
    pros: ["Built around passive, recurring investing habits"],
    considerations: ["Less suited to active/frequent trading"],
    regulatoryInformation: "Holds an AFSL — verify current licence status directly with ASIC's register.",
    websiteUrl: "https://pearler.com/",
    affiliateSlug: "pearler",
    sources: [{ label: "Pearler", url: "https://pearler.com/" }],
    lastVerifiedAt: null,
  },
  {
    slug: "interactive-brokers",
    name: "Interactive Brokers",
    category: ["share_trading", "forex"],
    description:
      "Global brokerage offering access to a wide range of international exchanges, forex and derivatives alongside ASX shares.",
    country: "United States (AU entity available)",
    products: ["Global shares", "ASX shares", "Forex", "Options", "Futures"],
    markets: ["ASX", "US", "Europe", "Asia", "Forex"],
    feesSummary: "Not verified — tiered/fixed pricing options, check current schedule",
    minimumDepositAmount: null,
    mobileApp: true,
    demoAccount: true,
    platformFeatures: ["Broad global market access", "Professional-grade trading tools"],
    pros: ["Widest market access of platforms listed here"],
    considerations: ["Interface more complex than beginner-focused apps"],
    regulatoryInformation: "Australian entity holds an AFSL — verify current licence status directly with ASIC's register.",
    websiteUrl: "https://www.interactivebrokers.com/",
    affiliateSlug: "interactive-brokers",
    sources: [{ label: "Interactive Brokers", url: "https://www.interactivebrokers.com/" }],
    lastVerifiedAt: null,
  },
];

export interface ExchangeSeed {
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

export const EXCHANGE_SEEDS: ExchangeSeed[] = [
  {
    slug: "binance",
    name: "Binance",
    description: "Large global cryptocurrency exchange offering spot and derivatives trading.",
    country: "Global (AU-accessible entity varies)",
    productsSupported: ["Spot trading", "Wide coin selection"],
    feesSummary: "Not verified — check provider for current fee schedule",
    regulatoryInformation: "Regulatory status varies by jurisdiction — verify current AU registration/AUSTRAC status directly.",
    websiteUrl: "https://www.binance.com/",
    affiliateSlug: "binance",
    sources: [{ label: "Binance", url: "https://www.binance.com/" }],
    lastVerifiedAt: null,
  },
  {
    slug: "coinspot",
    name: "CoinSpot",
    description: "Australian-based cryptocurrency exchange supporting AUD deposits and a wide range of coins.",
    country: "Australia",
    productsSupported: ["Spot trading", "AUD deposits/withdrawals"],
    feesSummary: "Not verified — check provider for current fee schedule",
    regulatoryInformation: "AUSTRAC-registered digital currency exchange — verify current registration status.",
    websiteUrl: "https://www.coinspot.com.au/",
    affiliateSlug: "coinspot",
    sources: [{ label: "CoinSpot", url: "https://www.coinspot.com.au/" }],
    lastVerifiedAt: null,
  },
  {
    slug: "independent-reserve",
    name: "Independent Reserve",
    description: "Australian cryptocurrency exchange serving retail and institutional clients.",
    country: "Australia",
    productsSupported: ["Spot trading", "AUD deposits/withdrawals"],
    feesSummary: "Not verified — check provider for current fee schedule",
    regulatoryInformation: "AUSTRAC-registered digital currency exchange — verify current registration status.",
    websiteUrl: "https://www.independentreserve.com/",
    affiliateSlug: "independent-reserve",
    sources: [{ label: "Independent Reserve", url: "https://www.independentreserve.com/" }],
    lastVerifiedAt: null,
  },
  {
    slug: "swyftx",
    name: "Swyftx",
    description: "Australian cryptocurrency exchange aimed at beginner and intermediate traders.",
    country: "Australia",
    productsSupported: ["Spot trading", "Demo account"],
    feesSummary: "Not verified — check provider for current fee schedule",
    regulatoryInformation: "AUSTRAC-registered digital currency exchange — verify current registration status.",
    websiteUrl: "https://swyftx.com/",
    affiliateSlug: "swyftx",
    sources: [{ label: "Swyftx", url: "https://swyftx.com/" }],
    lastVerifiedAt: null,
  },
];