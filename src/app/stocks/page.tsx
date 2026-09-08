import { getMarketDataProvider } from "@/lib/market-data";
import { redirect } from "next/navigation";

export const metadata = {
  title: "ASX Stocks | Australian Share Prices",
  description: "Share prices for major ASX-listed companies.",
};

// Starter list — Phase 3 replaces this with a real, searchable Stock
// table (already modelled in prisma/schema.prisma) instead of a
// hardcoded array.
const STOCKS = [
  { symbol: "BHP", name: "BHP Group" },
  { symbol: "CBA", name: "Commonwealth Bank" },
  { symbol: "CSL", name: "CSL Limited" },
  { symbol: "NAB", name: "National Australia Bank" },
  { symbol: "WBC", name: "Westpac" },
  { symbol: "WES", name: "Wesfarmers" },
  { symbol: "WOW", name: "Woolworths Group" },
  { symbol: "TLS", name: "Telstra" },
];

export default async function StocksIndexPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  // Simple ticker search — typing a symbol and submitting jumps
  // straight to its page. Real autocomplete (matching company names,
  // not just exact tickers) is a Phase 3 search-engine feature.
  if (searchParams?.q) {
    redirect(`/stocks/${searchParams.q.trim().toLowerCase()}`);
  }

  const provider = getMarketDataProvider();
  const quotes = await Promise.all(
    STOCKS.map(async (s) => ({ ...s, quote: await provider.getQuote(s.symbol) }))
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">ASX Stocks</h1>
      <p className="mt-1 text-sm text-slate-500">
        Search any ASX ticker, or browse a few major names below.
      </p>

      <form action="/stocks" className="mt-4">
        <input
          type="text"
          name="q"
          placeholder="Search by ticker, e.g. BHP"
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2">Company</th>
              <th className="py-2">Price</th>
              <th className="py-2">Change</th>
              <th className="py-2">Status</th>
              <th className="py-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map(({ symbol, name, quote }) => (
              <tr key={symbol} className="border-b border-slate-100">
                <td className="py-3">
                  <a href={`/stocks/${symbol.toLowerCase()}`} className="font-medium text-navy-900 hover:underline">
                    {name}
                  </a>
                  <span className="ml-2 text-xs text-slate-400">{symbol}</span>
                </td>
                <td className="py-3">{quote?.value.toFixed(2) ?? "—"}</td>
                <td className={quote && quote.change >= 0 ? "py-3 text-brand-green" : "py-3 text-brand-red"}>
                  {quote ? `${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(2)} (${quote.changePct.toFixed(2)}%)` : "—"}
                </td>
                <td className="py-3 text-[11px] uppercase text-slate-400">{quote?.status ?? "unavailable"}</td>
                <td className="py-3 text-xs text-slate-400">{quote?.source ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}