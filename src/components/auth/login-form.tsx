"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// signIn()/signOut() from "next-auth/react" work without a
// <SessionProvider> wrapping the app — that's only required by the
// useSession() hook, which nothing in this app uses yet (session
// state for display is read server-side via auth() instead, see
// src/app/layout.tsx SiteHeader). Keeping the provider out avoids an
// extra client-side wrapper around the whole app for a single form.
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setSubmitting(false);

    if (!result || result.error) {
      setError("Incorrect email or password.");
      return;
    }

    router.push("/watchlist");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-brand-red">{error}</p>
      )}
      <label className="block text-sm">
        <span className="font-medium text-slate-700">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-700">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-navy-900 px-4 py-2 text-sm font-medium disabled:opacity-60  border border-slate-300 text-slate-700"
      >
        {submitting ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-center text-sm text-slate-500">
        No account?{" "}
        <a href="/register" className="underline">
          Create one
        </a>
      </p>
    </form>
  );
}