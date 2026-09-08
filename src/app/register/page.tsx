import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create Account" };

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/watchlist");

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold text-navy-900">Create Account</h1>
      <p className="mt-1 text-sm text-slate-500">
        Free — save stocks, forex pairs and crypto to a watchlist, set
        basic price alerts, and save articles to read later.
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
      <p className="mt-6 text-xs text-slate-400">
        We only ask for your email and password — see our{" "}
        <a href="/privacy" className="underline">privacy policy</a>.
      </p>
    </div>
  );
}