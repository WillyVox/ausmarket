import { getMarketDataProvider } from "@/lib/market-data/mock-provider";

export const metadata = {
  title: "Crypto Prices in AUD",
  description: "Bitcoin, Ethereum and other crypto prices tracked in AUD and USD.",
};

const ASSETS = ["BTC", "ETH", "SOL", "XRP", "BNB"];

export default async function CryptoIndexPage() {
  const provider = getMarketDataProvider();
  const quotes = await Promise.all(
    ASSETS.map(async (symbol) => ({ symbol, quote: await provider.getCryptoPrice(symbol) }))
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Crypto Prices</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        Prices shown in AUD and USD. Crypto markets are highly volatile
        and largely unregulated — see our{" "}
        <a href="/risk-warning" className="underline">risk warning</a>.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2">Asset</th>
              <th className="py-2">Price (AUD)</th>
              <th className="py-2">Price (USD)</th>
              <th className="py-2">24h change</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map(({ symbol, quote }) => (
              <tr key={symbol} className="border-b border-slate-100">
                <td className="py-3 font-medium text-navy-900">
                  <a href={`/crypto/${symbol.toLowerCase()}`}>{symbol}</a>
                </td>
                <td className="py-3">
                  {quote ? `$${quote.priceAud.toLocaleString()}` : "—"}
                </td>
                <td className="py-3">
                  {quote ? `$${quote.priceUsd.toLocaleString()}` : "—"}
                </td>
                <td className={quote && quote.change24h >= 0 ? "py-3 text-brand-green" : "py-3 text-brand-red"}>
                  {quote ? `${quote.change24h.toFixed(2)}%` : "—"}
                </td>
                <td className="py-3 text-[11px] uppercase text-slate-400">{quote?.status ?? "unavailable"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
