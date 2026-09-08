import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EXCHANGES, getExchangeBySlug, verifiedLabel } from "@/lib/brokers/data";

export function generateStaticParams() {
  return EXCHANGES.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const exchange = getExchangeBySlug(params.slug);
  if (!exchange) return { title: "Exchange not found" };
  return {
    title: `${exchange.name} Review & Fees`,
    description: exchange.description,
  };
}

export default function ExchangePage({ params }: { params: { slug: string } }) {
  const exchange = getExchangeBySlug(params.slug);
  if (!exchange) notFound();

  const alternatives = EXCHANGES.filter((e) => e.slug !== exchange.slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header>
        <h1 className="text-2xl font-semibold text-navy-900">{exchange.name}</h1>
        <p className="mt-2 text-sm text-slate-600">{exchange.description}</p>
        <p className="mt-2 text-xs uppercase text-slate-400">
          Last verified: {verifiedLabel(exchange.lastVerifiedAt)}
        </p>
      </header>

      <div className="mt-6 flex gap-3">
        {exchange.affiliateSlug && (
          <a
            href={`/go/${exchange.affiliateSlug}?placement=exchange_page`}
            className="rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white"
          >
            Visit Provider
          </a>
        )}
        <a
          href="/compare/crypto-exchanges"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-navy-900"
        >
          Compare Alternatives
        </a>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy-900">Products</h2>
        <p className="mt-2 text-sm text-slate-700">{exchange.productsSupported.join(", ")}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy-900">Fees</h2>
        <p className="mt-2 text-sm text-slate-700">{exchange.feesSummary}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy-900">Regulatory information</h2>
        <p className="mt-2 text-sm text-slate-700">{exchange.regulatoryInformation}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy-900">Sources</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
          {exchange.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="underline" target="_blank" rel="noopener noreferrer nofollow">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy-900">Alternatives</h2>
        <ul className="mt-2 flex flex-wrap gap-2 text-sm">
          {alternatives.map((a) => (
            <li key={a.slug}>
              <a href={`/exchanges/${a.slug}`} className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-200">
                {a.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-xs text-slate-500">
        General information only, not personal financial advice.
        Cryptocurrency carries significant risk — see our{" "}
        <a href="/risk-warning" className="underline">risk warning</a>.
        We may receive a commission if you sign up through the link
        above — see our{" "}
        <a href="/affiliate-disclosure" className="underline">affiliate disclosure</a>.
      </p>
    </div>
  );
}
