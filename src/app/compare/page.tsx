import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Trading Platforms & Exchanges",
  description:
    "Compare Australian share trading platforms, forex platforms and crypto exchanges — transparent, sourced, and dated.",
};

const CATEGORIES = [
  {
    href: "/compare/share-trading-platforms",
    title: "Share Trading Platforms",
    description: "ASX and international share trading platforms for Australian investors.",
  },
  {
    href: "/compare/forex-platforms",
    title: "Forex Platforms",
    description: "Platforms offering forex trading to Australian traders.",
  },
  {
    href: "/compare/crypto-exchanges",
    title: "Crypto Exchanges",
    description: "Cryptocurrency exchanges available to Australian users.",
  },
  {
    href: "/compare/brokers",
    title: "All Brokers",
    description: "The full broker comparison table across all products.",
  },
];

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Compare Platforms</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Choose a category to compare platforms by products, pricing,
        features and market access. Every comparison follows the same{" "}
        <a href="/methodology" className="underline">methodology</a> —
        affiliate commission never determines ranking.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {CATEGORIES.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="block rounded-lg border border-slate-200 p-5 hover:border-slate-300"
          >
            <h2 className="font-semibold text-navy-900">{c.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{c.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
