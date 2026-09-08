import { PrismaClient } from "@prisma/client";

// Standard Next.js singleton pattern: without this, hot-reload in dev
// creates a new PrismaClient (and a new connection pool) on every
// file change. This is the ONLY place PrismaClient is instantiated —
// everything else imports `prisma` from here.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
