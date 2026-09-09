import { prisma } from "@/lib/db/prisma";

// The only module allowed to query AdPlacement directly (same
// per-table-repository convention as src/lib/brokers/repository.ts
// and src/lib/content/repository.ts).
//
// Fail-open, but in the opposite direction from market-data/brokers:
// if the database is unreachable, or there's no active row for a
// slot, AdSlot renders NOTHING rather than a fabricated ad. An empty
// ad slot is honest; a fake ad is not. There is no "static fallback
// ad" — that would be inventing inventory that was never actually
// configured.

export interface AdPlacementRecord {
  placement: string;
  type: string;
  provider: string;
  headline: string | null;
  body: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
}

export async function getActiveAdPlacement(placement: string): Promise<AdPlacementRecord | null> {
  try {
    const row = await prisma.adPlacement.findUnique({ where: { placement } });
    if (!row || row.status !== "active") return null;
    return {
      placement: row.placement,
      type: row.type,
      provider: row.provider,
      headline: row.headline,
      body: row.body,
      ctaLabel: row.ctaLabel,
      ctaHref: row.ctaHref,
    };
  } catch (err) {
    console.error(`[ads/repository] Could not load ad placement "${placement}":`, err);
    return null;
  }
}

// ---------- admin ----------

export interface AdPlacementAdminRow extends AdPlacementRecord {
  id: string;
  status: string;
  priority: number;
  updatedAt: string;
}

export async function listAdPlacementsForAdmin(): Promise<AdPlacementAdminRow[]> {
  const rows = await prisma.adPlacement.findMany({ orderBy: { placement: "asc" } });
  return rows.map((row) => ({
    id: row.id,
    placement: row.placement,
    type: row.type,
    provider: row.provider,
    status: row.status,
    priority: row.priority,
    headline: row.headline,
    body: row.body,
    ctaLabel: row.ctaLabel,
    ctaHref: row.ctaHref,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function setAdPlacementStatus(id: string, status: "active" | "inactive"): Promise<void> {
  await prisma.adPlacement.update({ where: { id }, data: { status } });
}