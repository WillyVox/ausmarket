import { NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToNewsletter } from "@/lib/newsletter/repository";

const Schema = z.object({
  email: z.string().email(),
  source: z.string().max(50).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid email" },
      { status: 400 }
    );
  }

  try {
    await subscribeToNewsletter(parsed.data.email, parsed.data.source ?? "unknown");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/newsletter/subscribe] Failed to record subscription:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}