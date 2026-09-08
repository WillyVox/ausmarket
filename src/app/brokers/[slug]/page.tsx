import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBrokers, getBrokerBySlug, verifiedLabel } from "@/lib/brokers/repository";

export async function generateStaticParams() {
  const brokers = await getBrokers();
  return brokers.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const broker = await getBrokerBySlug(slug);
  if (!broker) return { title: "Broker not found" };
  return {
    title: `${broker.name} Review & Fees`,
    description: broker.description,
  };
}

export default async function BrokerPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const broker = await getBrokerBySlug(slug);
  if (!broker) notFound();

  const allBrokers = await getBrokers();
  const alternatives = allBrokers.filter((b) => b.slug !== broker.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header>
        <h1 className="text-2xl font-semibold text-navy-900">{broker.name}</h1>
        <p className="mt-2 text-sm text-slate-600">{broker.description}</p>
        <p className="mt-2 text-xs uppercase text-slate-400">
          Last verified: {verifiedLabel(broker.lastVerifiedAt)}
        </p>
      </header>

      <div className="mt-6 flex gap-3">
        {broker.affiliateSlug && (
          <a
            href={`/go/${broker.affiliateSlug}?placement=broker_page`}
            className="rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white"
          >
            Visit Provider
          </a>
        )}
        <a
          href="/compare/brokers"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-navy-900"
        >
          Compare Alternatives
        </a>
      </div>

      <Section title="Products & Markets">
        <p className="text-sm text-slate-700">Products: {broker.products.join(", ")}</p>
        <p className="mt-1 text-sm text-slate-700">Markets: {broker.markets.join(", ")}</p>
      </Section>

      <Section title="Fees">
        <p className="text-sm text-slate-700">{broker.feesSummary}</p>
        <p className="mt-1 text-sm text-slate-700">Minimum deposit: {broker.minimumDeposit}</p>
      </Section>

      <Section title="Platform">
        <ul className="list-inside list-disc text-sm text-slate-700">
          {broker.platformFeatures.map((f) => (
            <li key={f}>{f}</li>
          ))}
          <li>Mobile app: {broker.mobileApp ? "Yes" : "Not verified"}</li>
          <li>Demo account: {broker.demoAccount ? "Yes" : "Not verified"}</li>
        </ul>
      </Section>

      <Section title="Pros">
        <ul className="list-inside list-disc text-sm text-slate-700">
          {broker.pros.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Section>

      <Section title="Things to consider">
        <ul className="list-inside list-disc text-sm text-slate-700">
          {broker.considerations.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Section>

      <Section title="Regulatory information">
        <p className="text-sm text-slate-700">{broker.regulatoryInformation}</p>
      </Section>

      <Section title="Sources">
        <ul className="list-inside list-disc text-sm text-slate-700">
          {broker.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="underline" target="_blank" rel="noopener noreferrer nofollow">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Alternatives">
        <ul className="flex flex-wrap gap-2 text-sm">
          {alternatives.map((a) => (
            <li key={a.slug}>
              <a href={`/brokers/${a.slug}`} className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-200">
                {a.name}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <p className="mt-8 text-xs text-slate-500">
        General information only, not personal financial advice. We may
        receive a commission if you sign up through the link above —
        see our{" "}
        <a href="/affiliate-disclosure" className="underline">affiliate disclosure</a>.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-navy-900">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}