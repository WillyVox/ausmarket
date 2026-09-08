import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { saveArticle, unsaveArticle } from "@/lib/saved-articles/repository";

const Schema = z.object({ articleSlug: z.string().min(1).max(200) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  await saveArticle(session.user.id, parsed.data.articleSlug);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  await unsaveArticle(session.user.id, parsed.data.articleSlug);
  return NextResponse.json({ ok: true });
}