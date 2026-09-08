import { prisma } from "@/lib/db/prisma";

// Unlike src/lib/brokers/repository.ts, there is no static fallback
// here — watchlist data is inherently per-user and there is nothing
// honest to fall back to if the database is unreachable. Callers
// (API routes, the /watchlist page) are expected to handle a thrown
// error as a real failure, not a degraded-but-working state.

export type WatchlistSymbolType = "stock" | "forex" | "crypto";

export interface WatchlistItemRecord {
  id: string;
  symbolType: WatchlistSymbolType;
  symbol: string;
  addedAt: string; // ISO
}

// MVP: one default watchlist per user, auto-created on first use.
// The schema supports multiple named watchlists per user (Watchlist
// has a `name` and a user can have many) — a "create new list" UI is
// left for a later phase; see docs/roadmap.md.
const DEFAULT_WATCHLIST_NAME = "My Watchlist";

async function getOrCreateDefaultWatchlist(userId: string) {
  const existing = await prisma.watchlist.findFirst({ where: { userId } });
  if (existing) return existing;
  return prisma.watchlist.create({
    data: { userId, name: DEFAULT_WATCHLIST_NAME },
  });
}

export async function listWatchlistItems(userId: string): Promise<WatchlistItemRecord[]> {
  const watchlist = await prisma.watchlist.findFirst({
    where: { userId },
    include: { items: { orderBy: { addedAt: "desc" } } },
  });
  if (!watchlist) return [];
  return watchlist.items.map((item: { id: string; symbolType: string; symbol: string; addedAt: Date }) => ({
    id: item.id,
    symbolType: item.symbolType as WatchlistSymbolType,
    symbol: item.symbol,
    addedAt: item.addedAt.toISOString(),
  }));
}

export async function addWatchlistItem(
  userId: string,
  symbolType: WatchlistSymbolType,
  symbol: string
): Promise<WatchlistItemRecord> {
  const watchlist = await getOrCreateDefaultWatchlist(userId);
  const normalizedSymbol = symbol.trim().toUpperCase();

  const item = await prisma.watchlistItem.upsert({
    where: {
      watchlistId_symbolType_symbol: {
        watchlistId: watchlist.id,
        symbolType,
        symbol: normalizedSymbol,
      },
    },
    update: {}, // already on the list — no-op, just return it
    create: { watchlistId: watchlist.id, symbolType, symbol: normalizedSymbol },
  });

  return {
    id: item.id,
    symbolType: item.symbolType as WatchlistSymbolType,
    symbol: item.symbol,
    addedAt: item.addedAt.toISOString(),
  };
}

// Deletes by id, but only if the item belongs to one of the calling
// user's own watchlists — prevents one user from deleting another
// user's watchlist item by guessing an id.
export async function removeWatchlistItem(userId: string, itemId: string): Promise<boolean> {
  const item = await prisma.watchlistItem.findUnique({
    where: { id: itemId },
    include: { watchlist: true },
  });
  if (!item || item.watchlist.userId !== userId) return false;

  await prisma.watchlistItem.delete({ where: { id: itemId } });
  return true;
}