export const metadata = {
  title: "Economic Calendar",
  description: "RBA, Fed and other key economic events affecting AUD and Australian markets.",
};

// Placeholder rows — Phase 2 replaces this with real EconomicEvent
// records (see prisma schema) covering AU/US/EU/JP/UK.
const PLACEHOLDER_EVENTS = [
  { event: "RBA Cash Rate Decision", country: "AU", currency: "AUD", importance: "high" },
  { event: "CPI (q/q)", country: "AU", currency: "AUD", importance: "high" },
  { event: "Non-Farm Payrolls", country: "US", currency: "USD", importance: "high" },
  { event: "FOMC Rate Decision", country: "US", currency: "USD", importance: "high" },
];

export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Economic Calendar</h1>
      <p className="mt-1 text-sm text-slate-500">
        Key events likely to move AUD and Australian markets.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[500px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2">Event</th>
              <th className="py-2">Country</th>
              <th className="py-2">Currency</th>
              <th className="py-2">Importance</th>
              <th className="py-2">Date / Actual</th>
            </tr>
          </thead>
          <tbody>
            {PLACEHOLDER_EVENTS.map((e) => (
              <tr key={e.event} className="border-b border-slate-100">
                <td className="py-3 font-medium text-navy-900">{e.event}</td>
                <td className="py-3">{e.country}</td>
                <td className="py-3">{e.currency}</td>
                <td className="py-3 capitalize">{e.importance}</td>
                <td className="py-3 text-slate-400">Not yet connected</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
