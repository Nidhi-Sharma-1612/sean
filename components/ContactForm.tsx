"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { cabins as defaultCabins, type Cabin } from "@/lib/data/cabins";
import { site } from "@/lib/site";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-bark-800 outline-none transition-colors focus:border-pine-600 focus:ring-1 focus:ring-pine-600";
const labelClass = "text-sm font-medium text-bark-800";

export default function ContactForm({
  cabins = defaultCabins,
  cabin = "",
  dates = "",
  guests = "",
}: {
  cabins?: Cabin[];
  cabin?: string;
  dates?: string;
  guests?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const isBookingRequest = Boolean(cabin && dates);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
    }).catch(() => null);

    setStatus(res?.ok ? "sent" : "failed");
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-3xl bg-pine-600/10 p-8 text-center sm:p-10">
        <CheckCircle2 size={36} strokeWidth={1.5} className="mx-auto text-pine-600" />
        <h2 className="mt-3 font-serif text-2xl text-bark-800">
          {isBookingRequest ? "Your request is on its way" : "Thanks for reaching out"}
        </h2>
        <p className="mt-2 text-sm text-bark-600">
          We&rsquo;ve got your message and will reply by email.
        </p>
        <Link
          href="/cabins"
          className="mt-6 inline-block rounded-full bg-pine-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-800"
        >
          Back to cabins
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Name</span>
          <input name="name" type="text" required autoComplete="name" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Email</span>
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Phone (optional)</span>
          <input name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Cabin (optional)</span>
          <select name="cabin" defaultValue={cabin} className={inputClass}>
            <option value="">Not sure yet</option>
            {cabins.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Dates (optional)</span>
          <input name="dates" type="text" defaultValue={dates} placeholder="e.g. June 12 to June 16" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Guests (optional)</span>
          <input name="guests" type="number" min={1} max={12} defaultValue={guests} className={inputClass} />
        </label>
      </div>

      <label className="block">
        <span className={labelClass}>Message</span>
        <textarea
          name="message"
          required
          rows={5}
          defaultValue={isBookingRequest ? "I'd like to request these dates. Please let me know the total and next steps." : ""}
          className={inputClass}
        />
      </label>

      {/* Hidden from people; bots that fill every field are ignored by the API. */}
      <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {status === "failed" && (
        <p role="alert" className="rounded-xl bg-stone-50 px-4 py-3 text-sm text-bark-600">
          We couldn&rsquo;t send your message just now. Please email us at{" "}
          <a href={`mailto:${site.email}`} className="font-semibold text-pine-600 underline">
            {site.email}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-pine-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-forest-800 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending..." : isBookingRequest ? "Send Booking Request" : "Send Message"}
      </button>
    </form>
  );
}
