import { LegalPage } from "@/components/legal-page";
import { getMethodologyStats } from "@/lib/brokers/repository";

export const metadata = { title: "Comparison Methodology" };

// Rendered dynamically on every request — the numbers below are
// computed from the live repository (database, or the labelled
// static fallback), not baked in at build time or hand-written.
export const dynamic = "force-dynamic";

const CRITERIA = [
  "Fees & brokerage",
  "Products & markets available",
  "Platform & mobile app quality",
  "Research & charting tools",
  "Education & demo accounts",
  "Customer support",
  "Regulatory standing",
];

export default async function MethodologyPage() {
  const stats = await getMethodologyStats();
  const totalPlatforms = stats.totalBrokers + stats.totalExchanges;
  const totalVerified = stats.verifiedBrokers + stats.verifiedExchanges;
  const totalActiveAffiliateLinks =
    stats.brokersWithActiveAffiliateLink + stats.exchangesWithActiveAffiliateLink;

  return (
    <LegalPage title="How We Compare Platforms">
      <p>
        Every platform on our comparison pages is assessed against the
        same fixed set of criteria:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        {CRITERIA.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <p>
        Each factual claim (fees, minimum deposit, supported markets,
        etc.) is sourced directly from the provider's own disclosure
        documents or website, with a "last verified" date shown on the
        comparison and broker pages. Where we can't verify a claim, we
        show <em>"Not verified"</em> rather than guessing.
      </p>
      <p className="font-medium">
        Commission does not determine ranking. A partner paying a
        higher commission is not scored or positioned more favourably
        because of it.
      </p>

      <div className="rounded-lg border border-slate-200 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Transparency Snapshot
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label="Platforms tracked" value={totalPlatforms} />
          <Stat
            label="Verified entries"
            value={`${totalVerified} / ${totalPlatforms}`}
          />
          <Stat label="Active affiliate links" value={totalActiveAffiliateLinks} />
          <Stat
            label="Affiliate clicks (30d)"
            value={stats.affiliateClicksLast30Days ?? "Unavailable"}
          />
          <Stat
            label="Data source"
            value={stats.dataSource === "database" ? "Database" : "Static fallback"}
          />
        </dl>
        <p className="mt-4 text-xs text-slate-400">
          Generated {new Date(stats.generatedAt).toLocaleString("en-AU")} —
          computed live from the current comparison data, not cached prose.
        </p>
        {stats.dataSource === "static-fallback" && (
          <p className="mt-2 text-xs text-amber-700">
            The comparison database is currently unreachable or unseeded,
            so this snapshot reflects the bundled fallback content
            rather than the live database.
          </p>
        )}
        {totalVerified < totalPlatforms && (
          <p className="mt-2 text-xs text-amber-700">
            {totalPlatforms - totalVerified} of {totalPlatforms} platform
            entries do not yet have a verified fee/feature check — those
            pages show "Not verified" for the relevant fields rather
            than an assumed figure.
          </p>
        )}
      </div>

      <p className="font-medium text-amber-700">
        LEGAL REVIEW REQUIRED — before this methodology is published as
        a factual claim, the actual scoring process needs to be built
        and independently auditable, not just described.
      </p>
    </LegalPage>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-navy-900">{value}</dd>
    </div>
  );
}