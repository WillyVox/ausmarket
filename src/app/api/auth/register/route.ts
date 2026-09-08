import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

// Auth.js's Credentials provider has no built-in sign-up flow — this
// is the custom registration endpoint the /register page posts to.
// After this succeeds, the client calls signIn("credentials", ...)
// itself to establish a session; this route only creates the row.

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(100).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase().trim();
  const { password, name } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, name: name ?? null, passwordHash },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/auth/register] Failed to create user:", err);
    return NextResponse.json(
      { error: "Something went wrong creating your account. Please try again." },
      { status: 500 }
    );
  }
}