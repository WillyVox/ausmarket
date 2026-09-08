"use client";

import { useState } from "react";

export function SaveArticleButton({
  articleSlug,
  initiallySaved,
  signedIn,
}: {
  articleSlug: string;
  initiallySaved: boolean;
  signedIn: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, setPending] = useState(false);

  if (!signedIn) {
    return (
      <a
        href="/login"
        className="shrink-0 whitespace-nowrap rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600"
      >
        Sign in to save
      </a>
    );
  }

  async function toggle() {
    setPending(true);
    const next = !saved;
    try {
      const res = await fetch("/api/saved-articles", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleSlug }),
      });
      if (res.ok) setSaved(next);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`shrink-0 whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium disabled:opacity-60 ${
        saved
          ? "border-navy-900 bg-navy-900 text-white"
          : "border-slate-300 text-slate-600"
      }`}
    >
      {saved ? "Saved" : "Save article"}
    </button>
  );
}