import { getMarketDataProvider } from "@/lib/market-data/mock-provider";

export const metadata = {
  title: "Australian Market News",
  description: "Latest Australian stock market, ASX, forex and crypto news.",
};

export default async function NewsPage() {
  const provider = getMarketDataProvider();
  const news = await provider.getNews({ limit: 10 });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Market News</h1>
      <p className="mt-1 text-sm text-slate-500">
        Summaries only — always linked to the original source.
      </p>

      {news.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-400">
          No news source connected yet. This wires up to a real feed in
          Phase 2 (`MarketDataProvider.getNews`) — headlines will always
          link out to the original publisher, never reproduce full
          articles.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-slate-100">
          {news.map((item) => (
            <li key={item.slug} className="py-4">
              <a href={item.sourceUrl} className="font-medium text-navy-900 hover:underline">
                {item.headline}
              </a>
              <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
              <p className="mt-1 text-xs text-slate-400">
                {item.source} · {new Date(item.publishedAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
