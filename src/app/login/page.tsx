import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/watchlist");

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold text-navy-900">Sign In</h1>
      <p className="mt-1 text-sm text-slate-500">
        Access your watchlist, price alerts and saved articles.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}