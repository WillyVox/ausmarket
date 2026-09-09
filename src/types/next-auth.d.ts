import type { DefaultSession } from "next-auth";

// Adds `id` to session.user — Auth.js's default session type doesn't
// include it, but every part of this app that reads the session
// needs the user's database id (to query Watchlist/UserAlert/
// SavedArticle rows), not just their email.
// Adds `role` alongside `id` — /admin/* pages gate on
// session.user.role === "ADMIN" (see src/lib/auth/admin.ts). Kept as
// a plain "USER" | "ADMIN" union here rather than importing the
// Prisma Role enum, so this file has no Prisma dependency.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: "USER" | "ADMIN";
  }
}