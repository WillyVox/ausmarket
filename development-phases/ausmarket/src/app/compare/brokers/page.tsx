import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Australian Trading Platforms",
  description:
    "Compare Australian share trading platforms by products, pricing, features and market access.",
};

// Placeholder rows — Phase 4 replaces this with live Broker records
// and the full scoring methodology, each claim carrying its own
// source + last-verified date.
const PLACEHOLDER_BROKERS = [
  { slug: "cmc-markets", name: "CMC Markets", lastVerifiedAt: "Not verified" },
  { slug: "commsec", name: "CommSec", lastVerifiedAt: "Not verified" },
  { slug: "stake", name: "Stake", lastVerifiedAt: "Not verified" },
];

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

      <table className="mt-8 w-full min-w-[600px] overflow-x-auto border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="py-2">Platform</th>
            <th className="py-2">Fees</th>
            <th className="py-2">Markets</th>
            <th className="py-2">Last verified</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {PLACEHOLDER_BROKERS.map((b) => (
            <tr key={b.slug} className="border-b border-slate-100">
              <td className="py-3 font-medium text-navy-900">{b.name}</td>
              <td className="py-3 text-slate-500">Not verified</td>
              <td className="py-3 text-slate-500">Not verified</td>
              <td className="py-3 text-slate-500">{b.lastVerifiedAt}</td>
              <td className="py-3">
                <a
                  href={`/go/${b.slug}?placement=compare_table`}
                  className="rounded-md bg-navy-900 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Visit Provider
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-6 text-xs text-slate-500">
        We may receive a commission if you sign up through certain links
        above — this does not affect the price you pay, and does not
        determine ranking. See our{" "}
        <a href="/affiliate-disclosure" className="underline">
          affiliate disclosure
        </a>.
      </p>
    </div>
  );
}
