import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";

// Every /admin/* page/route calls this first, before reading or
// writing anything. Two failure modes are handled differently on
// purpose:
//   - not signed in at all -> send to /login (they may just need to
//     authenticate, and /login already knows how to bounce back).
//   - signed in but not an admin -> notFound(), not a "403 you're not
//     allowed" page. This avoids confirming to a logged-in non-admin
//     that an admin area exists at all beyond "this URL doesn't
//     resolve to anything for you".
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  console.log("session.user", session.user.role);

  if (session.user.role !== "ADMIN") {
    notFound();
  }

  return session;
}