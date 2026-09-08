import { verifiedLabel } from "@/lib/brokers/repository";

interface ComparisonRow {
  slug: string;
  name: string;
  feesSummary: string;
  marketsOrProducts: string;
  lastVerifiedAt: string | null;
  affiliateSlug: string | null;
  detailHref: string;
}

// Shared table for /compare/brokers, /compare/share-trading-platforms,
// /compare/forex-platforms and /compare/crypto-exchanges. Keeping this
// in one place means the "affiliate commission never determines rank"
// rule and the sourced/dated columns only need to be right once.
export function ComparisonTable({
  rows,
  marketsColumnLabel = "Markets",
}: {
  rows: ComparisonRow[];
  marketsColumnLabel?: string;
}) {
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="py-2 pr-4">Platform</th>
            <th className="py-2 pr-4">Fees</th>
            <th className="py-2 pr-4">{marketsColumnLabel}</th>
            <th className="py-2 pr-4">Last verified</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.slug} className="border-b border-slate-100 align-top">
              <td className="py-3 pr-4 font-medium text-navy-900">
                <a href={r.detailHref} className="hover:underline">
                  {r.name}
                </a>
              </td>
              <td className="py-3 pr-4 text-slate-500">{r.feesSummary}</td>
              <td className="py-3 pr-4 text-slate-500">{r.marketsOrProducts}</td>
              <td className="py-3 pr-4 text-slate-500">{verifiedLabel(r.lastVerifiedAt)}</td>
              <td className="py-3">
                {r.affiliateSlug ? (
                  <a
                    href={`/go/${r.affiliateSlug}?placement=compare_table`}
                    className="whitespace-nowrap rounded-md bg-navy-900 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Visit Provider
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Not available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-xs text-slate-500">
        Affiliate commission does not determine ranking or the order
        shown above — see our{" "}
        <a href="/methodology" className="underline">methodology</a> and{" "}
        <a href="/affiliate-disclosure" className="underline">affiliate disclosure</a>.
      </p>
    </div>
  );
}