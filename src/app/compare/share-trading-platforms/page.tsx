import type { Metadata } from "next";
import { getBrokersByCategory } from "@/lib/brokers/data";
import { ComparisonTable } from "@/components/comparison-table";

export const metadata: Metadata = {
  title: "Compare Australian Share Trading Platforms",
  description:
    "Compare ASX and international share trading platforms available to Australian investors.",
};

export default function ShareTradingPlatformsPage() {
  const brokers = getBrokersByCategory("share_trading");
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">
        Compare Australian Share Trading Platforms
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Platforms that support ASX and/or international share trading
        for Australian investors. See our{" "}
        <a href="/methodology" className="underline">methodology</a> for
        how these are evaluated. General information only.
      </p>

      <ComparisonTable
        rows={brokers.map((b) => ({
          slug: b.slug,
          name: b.name,
          feesSummary: b.feesSummary,
          marketsOrProducts: b.markets.join(", "),
          lastVerifiedAt: b.lastVerifiedAt,
          affiliateSlug: b.affiliateSlug,
          detailHref: `/brokers/${b.slug}`,
        }))}
      />

      <p className="mt-8 text-sm text-slate-600">
        Trading forex instead?{" "}
        <a href="/compare/forex-platforms" className="underline">
          Compare forex platforms
        </a>
        . Trading crypto?{" "}
        <a href="/compare/crypto-exchanges" className="underline">
          Compare crypto exchanges
        </a>.
      </p>
    </div>
  );
}
