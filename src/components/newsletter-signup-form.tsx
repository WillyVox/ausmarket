"use client";

import { useState } from "react";

export function NewsletterSignupForm({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="text-sm text-slate-600">You&apos;re subscribed — thanks!</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex max-w-sm gap-2">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="whitespace-nowrap rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {status === "submitting" ? "..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-1 text-xs text-brand-red">Something went wrong — please try again.</p>
      )}
    </div>
  );
}