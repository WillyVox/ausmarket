import type { Metadata } from "next";
import { auth } from "@/auth";
import { listWatchlistItems } from "@/lib/watchlist/repository";
import { WatchlistPanel } from "@/components/account/watchlist-panel";

export const metadata: Metadata = { title: "Watchlist" };

// User-specific data — never statically generated or cached.
export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-navy-900">Watchlist</h1>
        <p className="mt-4 rounded-lg border border-slate-200 p-6 text-sm text-slate-600">
          Sign in to track stocks, forex pairs and crypto assets in one
          place.
        </p>
        <div className="mt-4 flex gap-3">
          <a href="/login" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
            Sign In
          </a>
          <a href="/register" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
            Create Account
          </a>
        </div>
      </div>
    );
  }

  const items = await listWatchlistItems(session.user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy-900">Watchlist</h1>
      <p className="mt-1 text-sm text-slate-500">
        Track stocks, forex pairs and crypto assets you're keeping an eye on.
      </p>
      <div className="mt-6">
        <WatchlistPanel initialItems={items} />
      </div>
    </div>
  );
}
