import { prisma } from "@/lib/db/prisma";

// IMPORTANT: this is bookkeeping only. There is no evaluation engine
// that checks these conditions against live prices, and no
// notification delivery (email/push/SMS) — creating an alert here
// records the user's intent but does not currently trigger anything.
// Don't let the UI imply otherwise; see the note on the /watchlist
// page. Building the actual evaluation + delivery pipeline is a
// Phase 6+ item (docs/roadmap.md).

export interface AlertRecord {
  id: string;
  symbol: string;
  condition: string;
  active: boolean;
  createdAt: string; // ISO
}

export async function listAlerts(userId: string): Promise<AlertRecord[]> {
  const alerts = await prisma.userAlert.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return alerts.map((a) => ({
    id: a.id,
    symbol: a.symbol,
    condition: a.condition,
    active: a.active,
    createdAt: a.createdAt.toISOString(),
  }));
}

export async function createAlert(
  userId: string,
  symbol: string,
  condition: string
): Promise<AlertRecord> {
  const alert = await prisma.userAlert.create({
    data: { userId, symbol: symbol.trim().toUpperCase(), condition: condition.trim() },
  });
  return {
    id: alert.id,
    symbol: alert.symbol,
    condition: alert.condition,
    active: alert.active,
    createdAt: alert.createdAt.toISOString(),
  };
}

export async function deleteAlert(userId: string, alertId: string): Promise<boolean> {
  const alert = await prisma.userAlert.findUnique({ where: { id: alertId } });
  if (!alert || alert.userId !== userId) return false;
  await prisma.userAlert.delete({ where: { id: alertId } });
  return true;
}