"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name || undefined, email, password }),
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(body.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    // Registration succeeded — sign the new user in immediately
    // rather than sending them to a separate login step.
    const result = await signIn("credentials", { email, password, redirect: false });
    setSubmitting(false);

    if (!result || result.error) {
      // Account was created but sign-in failed for some reason —
      // send them to /login rather than silently failing.
      router.push("/login");
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
        <span className="font-medium text-slate-700">Name (optional)</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
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
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <span className="mt-1 block text-xs text-slate-400">At least 8 characters.</span>
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {submitting ? "Creating account..." : "Create account"}
      </button>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <a href="/login" className="underline">
          Sign in
        </a>
      </p>
    </form>
  );
}