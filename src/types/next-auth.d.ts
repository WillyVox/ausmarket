import type { DefaultSession } from "next-auth";

// Adds `id` to session.user — Auth.js's default session type doesn't
// include it, but every part of this app that reads the session
// needs the user's database id (to query Watchlist/UserAlert/
// SavedArticle rows), not just their email.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
  }
}