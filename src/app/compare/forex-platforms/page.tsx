import type { Metadata } from "next";
import { getBrokersByCategory } from "@/lib/brokers/repository";
import { ComparisonTable } from "@/components/comparison-table";

export const metadata: Metadata = {
  title: "Compare Australian Forex Trading Platforms",
  description:
    "Compare forex trading platforms available to Australian traders by markets, fees and features.",
};

export default async function ForexPlatformsPage() {
  const brokers = await getBrokersByCategory("forex");
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">
        Compare Australian Forex Platforms
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Platforms offering forex trading to Australian users. Forex
        and CFD trading carries significant risk — see our{" "}
        <a href="/risk-warning" className="underline">risk warning</a>{" "}
        before trading. General information only.
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
    </div>
  );
}
