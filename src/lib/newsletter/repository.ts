import { prisma } from "@/lib/db/prisma";

// No account required to subscribe — NewsletterSubscriber is
// deliberately not tied to User. Sending actual newsletters is out of
// scope here (no email-sending provider is configured anywhere in
// this project) — this only records the signup.
export async function subscribeToNewsletter(email: string, source: string): Promise<void> {
  const normalized = email.toLowerCase().trim();
  await prisma.newsletterSubscriber.upsert({
    where: { email: normalized },
    update: {}, // already subscribed — no-op, treat as success
    create: { email: normalized, source },
  });
}