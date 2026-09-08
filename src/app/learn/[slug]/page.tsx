import { notFound } from "next/navigation";
import type { Metadata } from "next";

// First real content piece — the rest of the /learn/[slug] articles
// follow this shape. Content here is genuinely written (not spun/
// AI-farmed) and kept short, neutral, and Australia-specific per the
// brief's education requirements.
const ARTICLES: Record<string, { title: string; body: string[] }> = {
  "what-is-asx-200": {
    title: "What is the ASX 200?",
    body: [
      "The ASX 200 (ticker: XJO) is an index tracking the 200 largest companies listed on the Australian Securities Exchange by float-adjusted market capitalisation. It's the most widely used benchmark for the Australian share market, similar in role to the S&P 500 in the US.",
      "The index is reviewed and rebalanced quarterly by S&P Dow Jones Indices, which can add or remove companies as their market value changes relative to others.",
      "You can't invest directly in the index itself, but many exchange-traded funds (ETFs) are designed to track its performance, giving investors broad exposure to the Australian market in a single trade.",
    ],
  },
  "what-is-an-etf": {
    title: "What is an ETF?",
    body: [
      "An exchange-traded fund (ETF) is a fund that holds a basket of assets — shares, bonds, commodities, or a mix — and trades on an exchange like a single stock.",
      "Most ETFs aim to track an index (like the ASX 200) rather than trying to beat it, which typically keeps their management fees lower than actively managed funds.",
      "Like any listed security, ETF prices can rise or fall, and past performance of the underlying index is not a guarantee of future results.",
    ],
  },
};

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = ARTICLES[params.slug];
  return {
    title: article ? article.title : "Learn",
    description: article?.body[0]?.slice(0, 150),
  };
}

export default function LearnArticlePage({ params }: { params: { slug: string } }) {
  const article = ARTICLES[params.slug];
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">{article.title}</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
        {article.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <p className="mt-8 text-xs text-slate-400">
        General information only, not personal financial advice.
      </p>
    </article>
  );
}
