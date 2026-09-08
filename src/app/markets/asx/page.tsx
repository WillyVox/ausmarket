import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASX — Australian Securities Exchange Overview",
  description:
    "Overview of the Australian Securities Exchange (ASX): what it is, how it works, and where to find live market data.",
};

// Overview of the exchange itself, distinct from /markets/asx-200
// (the index). Chart/live-breadth data lands once a licensed ASX
// feed is configured — see docs/compliance-flags.md.
export default function AsxOverviewPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">
        ASX — Australian Securities Exchange
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        The ASX (Australian Securities Exchange) is Australia's primary
        securities exchange, where shares, ETFs and other listed
        products are traded. The ASX 200 is the most widely followed
        index of companies listed on the exchange.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <a
          href="/markets/asx-200"
          className="rounded-lg border border-slate-200 p-5 hover:border-slate-300"
        >
          <h2 className="font-semibold text-navy-900">ASX 200</h2>
          <p className="mt-1 text-sm text-slate-600">
            Current level, daily change and performance of the top 200
            companies by market cap.
          </p>
        </a>
        <a
          href="/markets/all-ordinaries"
          className="rounded-lg border border-slate-200 p-5 hover:border-slate-300"
        >
          <h2 className="font-semibold text-navy-900">All Ordinaries</h2>
          <p className="mt-1 text-sm text-slate-600">
            The broader index covering the largest ~500 ASX-listed companies.
          </p>
        </a>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-navy-900">Search ASX Shares</h2>
        <p className="mt-2 text-sm text-slate-600">
          Looking for a specific company?{" "}
          <a href="/stocks" className="underline">Search ASX share prices</a>.
        </p>
      </section>

      <section className="mt-10 rounded-lg border border-slate-200 p-5">
        <p className="text-sm text-slate-700">Want to trade ASX shares?</p>
        <a
          href="/compare/share-trading-platforms"
          className="mt-2 inline-block rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white"
        >
          Compare Platforms
        </a>
      </section>
    </div>
  );
}
