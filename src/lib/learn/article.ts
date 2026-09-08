// Single source of truth for /learn content. Both /learn (index),
// /learn/[slug] (article page), and the saved-articles panel
// (src/components/account/*) import from here so a saved slug can
// always resolve back to a real title without duplicating content.

export interface LearnArticle {
    slug: string;
    title: string;
    body: string[];
    related: { href: string; label: string }[];
  }
  
  export const ARTICLES: Record<string, LearnArticle> = {
    "what-is-asx-200": {
      slug: "what-is-asx-200",
      title: "What is the ASX 200?",
      body: [
        "The ASX 200 (ticker: XJO) is an index tracking the 200 largest companies listed on the Australian Securities Exchange by float-adjusted market capitalisation. It's the most widely used benchmark for the Australian share market, similar in role to the S&P 500 in the US.",
        "The index is reviewed and rebalanced quarterly by S&P Dow Jones Indices, which can add or remove companies as their market value changes relative to others.",
        "You can't invest directly in the index itself, but many exchange-traded funds (ETFs) are designed to track its performance, giving investors broad exposure to the Australian market in a single trade.",
      ],
      related: [
        { href: "/markets/asx-200", label: "ASX 200 today" },
        { href: "/learn/what-is-an-etf", label: "What is an ETF?" },
        { href: "/compare/share-trading-platforms", label: "Compare share trading platforms" },
      ],
    },
    "what-is-an-etf": {
      slug: "what-is-an-etf",
      title: "What is an ETF?",
      body: [
        "An exchange-traded fund (ETF) is a fund that holds a basket of assets — shares, bonds, commodities, or a mix — and trades on an exchange like a single stock.",
        "Most ETFs aim to track an index (like the ASX 200) rather than trying to beat it, which typically keeps their management fees lower than actively managed funds.",
        "Like any listed security, ETF prices can rise or fall, and past performance of the underlying index is not a guarantee of future results.",
      ],
      related: [
        { href: "/learn/what-is-asx-200", label: "What is the ASX 200?" },
        { href: "/learn/what-is-market-cap", label: "What is market capitalisation?" },
        { href: "/compare/share-trading-platforms", label: "Compare share trading platforms" },
      ],
    },
    "what-is-market-cap": {
      slug: "what-is-market-cap",
      title: "What is market capitalisation?",
      body: [
        "Market capitalisation (\"market cap\") is the total value of a listed company's shares, calculated by multiplying its current share price by the total number of shares on issue.",
        "It's a common way to gauge a company's size relative to others, and is often used to group companies into categories such as large-cap, mid-cap and small-cap.",
        "Market cap reflects what the market is currently willing to pay for the company as a whole — it is not the same as a company's revenue, profit, or the cash it holds.",
      ],
      related: [
        { href: "/learn/what-is-asx-200", label: "What is the ASX 200?" },
        { href: "/stocks", label: "Search ASX shares" },
      ],
    },
    "what-is-brokerage": {
      slug: "what-is-brokerage",
      title: "What is brokerage?",
      body: [
        "Brokerage is the fee a trading platform or broker charges for executing a buy or sell order on your behalf, typically charged per trade.",
        "Brokerage structures vary: some platforms charge a flat fee per trade, others charge a percentage of the trade value, and some offer $0 brokerage on certain trades while charging elsewhere (for example, via the spread or account fees).",
        "Comparing brokerage alone doesn't tell the whole story — it's worth checking the full fee schedule, including any account-keeping, currency conversion, or inactivity fees, before choosing a platform.",
      ],
      related: [
        { href: "/compare/share-trading-platforms", label: "Compare share trading platforms" },
        { href: "/methodology", label: "How we compare platforms" },
      ],
    },
    "what-is-a-cfd": {
      slug: "what-is-a-cfd",
      title: "What is a CFD?",
      body: [
        "A contract for difference (CFD) is a derivative product that lets you speculate on the price movement of an asset — such as a share, index, currency pair or commodity — without owning the underlying asset itself.",
        "CFDs are typically traded on margin, meaning you only put up a fraction of the position's full value. This can amplify both gains and losses relative to the amount you've put in.",
        "CFDs carry significant risk and are not suitable for all investors. Regulators in Australia require providers to give retail clients specific risk warnings before trading CFDs — see our risk warning page for more.",
      ],
      related: [
        { href: "/risk-warning", label: "Risk warning" },
        { href: "/compare/forex-platforms", label: "Compare forex platforms" },
        { href: "/learn/what-is-brokerage", label: "What is brokerage?" },
      ],
    },
  };
  
  export function getArticleBySlug(slug: string): LearnArticle | null {
    return ARTICLES[slug] ?? null;
  }
  
  export function getAllArticles(): LearnArticle[] {
    return Object.values(ARTICLES);
  }
  
  // Used by the saved-articles panel: resolve a stored slug to a
  // display title even if the underlying content later changes shape,
  // and degrade gracefully (rather than crash) if a slug is ever
  // orphaned (e.g. an article gets renamed/removed).
  export function getArticleTitle(slug: string): string {
    return ARTICLES[slug]?.title ?? slug;
  }