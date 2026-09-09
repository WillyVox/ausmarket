import { requireAdmin } from "@/lib/auth/admin";
import { getAffiliateAnalytics, type AnalyticsWindow } from "@/lib/brokers/repository";

export const metadata = { title: "Affiliate Analytics" };
export const dynamic = "force-dynamic";

const WINDOWS: AnalyticsWindow[] = [7, 30, 90, 365];

export default async function AdminAffiliatePage({
  searchParams,
}: {
  searchParams: Promise<{ window?: string }>;
}) {
  await requireAdmin();
  const { window: windowParam } = await searchParams;
  const windowDays = (WINDOWS.find((w) => String(w) === windowParam) ?? 30) as AnalyticsWindow;

  const analytics = await getAffiliateAnalytics(windowDays);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Affiliate Analytics</h1>
      <p className="mt-2 text-sm text-slate-600">
        Clicks recorded via <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">/go/[partner]</code>.
        This counts outbound redirects only — not confirmed signups, deposits, or commission.
      </p>

      <div className="mt-6 flex gap-2">
        {WINDOWS.map((w) => (
          <a
            key={w}
            href={`/admin/affiliate?window=${w}`}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              w === windowDays ? "bg-navy-900 text-white" : "border border-slate-300 text-slate-700"
            }`}
          >
            {w}d
          </a>
        ))}
      </div>

      {!analytics ? (
        <p className="mt-8 text-sm text-amber-700">
          Analytics are currently unavailable — the database could not be reached.
        </p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label={`Clicks (${windowDays}d)`} value={analytics.totalClicks} />
            <Stat label="Revenue" value="Unavailable" muted />
            <Stat label="Conversions" value="Unavailable" muted />
            <Stat label="CTR" value="Unavailable" muted />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Revenue, conversions and CTR require a payout/postback integration and page-view
            tracking, neither of which exist yet — shown as "Unavailable" rather than estimated.
          </p>

          <Section title="Clicks by partner">
            {analytics.byPartner.length === 0 ? (
              <EmptyRow />
            ) : (
              <Table
                rows={analytics.byPartner.map((p) => [
                  `${p.partnerName} (${p.partnerType})`,
                  String(p.clicks),
                ])}
                headers={["Partner", "Clicks"]}
              />
            )}
          </Section>

          <Section title="Clicks by placement">
            {analytics.byPlacement.length === 0 ? (
              <EmptyRow />
            ) : (
              <Table
                rows={analytics.byPlacement.map((p) => [p.key, String(p.clicks)])}
                headers={["Placement", "Clicks"]}
              />
            )}
          </Section>

          <Section title="Clicks by device">
            {analytics.byDevice.length === 0 ? (
              <EmptyRow />
            ) : (
              <Table
                rows={analytics.byDevice.map((d) => [d.key, String(d.clicks)])}
                headers={["Device", "Clicks"]}
              />
            )}
          </Section>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, muted }: { label: string; value: string | number; muted?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className={`mt-1 text-lg font-semibold ${muted ? "text-slate-400" : "text-navy-900"}`}>{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-slate-500">
          {headers.map((h) => (
            <th key={h} className="py-2 pr-4">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-slate-100">
            {row.map((cell, j) => (
              <td key={j} className="py-2 pr-4 text-slate-700">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EmptyRow() {
  return <p className="text-sm text-slate-400">No clicks in this window.</p>;
}