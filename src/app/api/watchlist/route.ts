import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { listWatchlistItems, addWatchlistItem, removeWatchlistItem } from "@/lib/watchlist/repository";

const AddSchema = z.object({
  symbolType: z.enum(["stock", "forex", "crypto"]),
  symbol: z.string().min(1).max(20),
});

const RemoveSchema = z.object({
  itemId: z.string().min(1),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  const items = await listWatchlistItems(session.user.id);
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = AddSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const item = await addWatchlistItem(session.user.id, parsed.data.symbolType, parsed.data.symbol);
  return NextResponse.json({ item });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = RemoveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const removed = await removeWatchlistItem(session.user.id, parsed.data.itemId);
  if (!removed) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}