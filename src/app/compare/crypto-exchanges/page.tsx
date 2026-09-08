import type { Metadata } from "next";
import { EXCHANGES } from "@/lib/brokers/data";
import { ComparisonTable } from "@/components/comparison-table";

export const metadata: Metadata = {
  title: "Compare Crypto Exchanges Australia",
  description:
    "Compare cryptocurrency exchanges available to Australian users by fees, coins supported and regulatory status.",
};

export default function CryptoExchangesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">
        Compare Crypto Exchanges (Australia)
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Cryptocurrency exchanges available to Australian users.
        Cryptocurrency is a high-risk, unregulated asset class in many
        respects — see our{" "}
        <a href="/risk-warning" className="underline">risk warning</a>{" "}
        before trading. General information only.
      </p>

      <ComparisonTable
        marketsColumnLabel="Products"
        rows={EXCHANGES.map((e) => ({
          slug: e.slug,
          name: e.name,
          feesSummary: e.feesSummary,
          marketsOrProducts: e.productsSupported.join(", "),
          lastVerifiedAt: e.lastVerifiedAt,
          affiliateSlug: e.affiliateSlug,
          detailHref: `/exchanges/${e.slug}`,
        }))}
      />
    </div>
  );
}
