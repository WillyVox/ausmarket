export const metadata = { title: "Watchlist" };

export default function WatchlistPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-sm text-slate-600">
      <h1 className="text-2xl font-semibold text-navy-900">Watchlist</h1>
      <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-slate-400">
        Accounts and saved watchlists are built in Phase 5 (Auth.js +
        the Watchlist/WatchlistItem models already in the Prisma
        schema). Nothing to see here yet.
      </p>
    </div>
  );
}
