import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { listAlerts, createAlert, deleteAlert } from "@/lib/alerts/repository";

// Reminder (see src/lib/alerts/repository.ts): this is bookkeeping
// only. Creating an alert here does not trigger any evaluation or
// notification — there is no such engine yet.

const CreateSchema = z.object({
  symbol: z.string().min(1).max(20),
  condition: z.string().min(1).max(100),
});

const DeleteSchema = z.object({
  alertId: z.string().min(1),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  const alerts = await listAlerts(session.user.id);
  return NextResponse.json({ alerts });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const alert = await createAlert(session.user.id, parsed.data.symbol, parsed.data.condition);
  return NextResponse.json({ alert });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = DeleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const removed = await deleteAlert(session.user.id, parsed.data.alertId);
  if (!removed) {
    return NextResponse.json({ error: "Alert not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}