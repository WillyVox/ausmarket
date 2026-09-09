import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

// Credentials (email + password) is the baseline provider so the app
// is fully testable locally without any external OAuth app or SMTP
// server configured — the same "works with nothing configured"
// principle as src/lib/market-data falling back to mock data. Adding
// a real OAuth provider or a magic-link email provider later is a
// config change here (add to `providers`), not a rewrite — but note
// OAuth/email providers typically need the Auth.js Prisma adapter
// (Account/Session/VerificationToken tables), which this schema does
// not yet have since only Credentials is wired up.
//
// Session strategy is JWT rather than database-backed: Credentials
// provider doesn't have a first-class database session flow in
// Auth.js, and JWT sessions mean no Session table is needed for now.

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email.toLowerCase().trim() : null;
        const password = typeof credentials?.password === "string" ? credentials.password : null;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        // No passwordHash means either no such user, or an account
        // that was created without one (e.g. a future OAuth-only
        // user) — either way, credentials sign-in can't succeed.
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        // `user` here is whatever authorize() returned, which is not
        // typed against our Prisma Role enum — narrow defensively so
        // a bad/missing value can never silently grant ADMIN.
        token.role = (user as { role?: unknown }).role === "ADMIN" ? "ADMIN" : "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.userId === "string") {
        session.user.id = token.userId;
        session.user.role = token.role === "ADMIN" ? "ADMIN" : "USER";
      }
      return session;
    },
  },
});