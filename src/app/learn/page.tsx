export const metadata = {
  title: "Learn — Australian Investing Education",
  description: "Plain-English guides to the ASX, ETFs, forex, crypto and trading basics.",
};

const CATEGORIES = [
  "Australian Investing",
  "ASX",
  "Stocks",
  "ETF",
  "Forex",
  "Crypto",
  "Trading",
  "Economy",
  "RBA",
  "Broker Guides",
];

const ARTICLES = [
  { slug: "what-is-asx-200", title: "What is the ASX 200?" },
  { slug: "what-is-an-etf", title: "What is an ETF?" },
  { slug: "what-is-market-cap", title: "What is market capitalisation?" },
  { slug: "what-is-brokerage", title: "What is brokerage?" },
  { slug: "what-is-a-cfd", title: "What is a CFD?" },
];

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Learn</h1>
      <p className="mt-1 text-sm text-slate-500">
        Plain-English, neutral education — not personal financial advice.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <span key={c} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
            {c}
          </span>
        ))}
      </div>

      <ul className="mt-8 divide-y divide-slate-100">
        {ARTICLES.map((a) => (
          <li key={a.slug} className="py-3">
            <a href={`/learn/${a.slug}`} className="font-medium text-navy-900 hover:underline">
              {a.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
