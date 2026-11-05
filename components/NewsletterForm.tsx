"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "invalid" | "failed">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
    }).catch(() => null);

    setStatus(res?.ok ? "sent" : res?.status === 400 ? "invalid" : "failed");
  }

  if (status === "sent") {
    return (
      <p role="status" className="flex items-center gap-2 text-sm font-medium text-white">
        <CheckCircle2 size={18} className="shrink-0 text-caramel-300" />
        You&rsquo;re on the list. Watch your inbox for news from the Smokies.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={status === "invalid"}
          className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/60 outline-none transition-colors focus:border-caramel-300 focus:bg-white/15"
        />
        {/* Hidden from people; bots that fill every field are ignored by the API. */}
        <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-caramel-300 px-6 py-3 text-sm font-semibold text-bark-800 transition-colors hover:bg-white disabled:opacity-60"
        >
          {status === "sending" ? "Subscribing..." : "Subscribe"}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {status === "invalid" && (
        <p role="alert" className="mt-2 text-xs text-caramel-300">
          Please enter a valid email address.
        </p>
      )}
      {status === "failed" && (
        <p role="alert" className="mt-2 text-xs text-caramel-300">
          We couldn&rsquo;t sign you up just now. Please try again in a moment.
        </p>
      )}
    </form>
  );
}
