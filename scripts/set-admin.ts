// One-off CLI to promote an existing account to ADMIN. There is no
// in-app way to do this (an admin-only page can't be the thing that
// creates the first admin), so this is the bootstrap path.
//
// Usage:
//   npm run make:admin -- you@example.com
//
// The user must already have registered an account via /register
// before running this.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.toLowerCase().trim();
  if (!email) {
    console.error("Usage: npm run make:admin -- you@example.com");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No account found for ${email} — register one at /register first.`);
    process.exit(1);
  }

  await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
  console.log(`✓ ${email} is now an ADMIN. They'll need to sign out and back in for it to take effect (role is baked into the JWT at sign-in).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });