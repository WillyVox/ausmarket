import type { Metadata } from "next";
import { BROKERS } from "@/lib/brokers/data";
import { ComparisonTable } from "@/components/comparison-table";

export const metadata: Metadata = {
  title: "Compare Australian Trading Platforms",
  description:
    "Compare Australian share trading and forex platforms by products, pricing, features and market access.",
};

export default function CompareBrokersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">
        Compare Australian Trading Platforms
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Compare platforms by products, pricing, features and market
        access. Every claim below is sourced and dated — see our{" "}
        <a href="/methodology" className="underline">methodology</a>.
        This is general information, not personal financial advice.
      </p>

      <ComparisonTable
        rows={BROKERS.map((b) => ({
          slug: b.slug,
          name: b.name,
          feesSummary: b.feesSummary,
          marketsOrProducts: b.markets.join(", "),
          lastVerifiedAt: b.lastVerifiedAt,
          affiliateSlug: b.affiliateSlug,
          detailHref: `/brokers/${b.slug}`,
        }))}
      />

      <p className="mt-6 text-xs text-slate-500">
        We may receive a commission if you sign up through certain links
        above — this does not affect the price you pay. See our{" "}
        <a href="/affiliate-disclosure" className="underline">
          affiliate disclosure
        </a>.
      </p>
    </div>
  );
}
