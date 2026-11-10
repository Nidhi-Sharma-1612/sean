"use client";

import { CalendarDays, ChevronDown, Minus, Plus, Star, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { formatRating } from "@/components/CabinCard";
import DateRangeCalendar from "@/components/DateRangeCalendar";
import { canStay } from "@/lib/availability";
import type { Cabin } from "@/lib/data/cabins";
import { formatDisplayDate, isAfter, nightsBetween, parseISODate, toISODate } from "@/lib/date";
import type { StaySearch } from "@/lib/search";
import { guestyBookingUrl } from "@/lib/site";
import { useAvailability } from "@/lib/useAvailability";

const stepper =
  "flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-bark-600 transition-colors hover:border-pine-600 hover:text-pine-600 disabled:opacity-30";

export default function BookingCard({ cabin, initial }: { cabin: Cabin; initial: StaySearch }) {
  const [checkIn, setCheckIn] = useState(() => parseISODate(initial.checkIn ?? ""));
  const [checkOut, setCheckOut] = useState(() => parseISODate(initial.checkOut ?? ""));
  const [guests, setGuests] = useState(() => Math.min(initial.guests ?? 2, cabin.guests));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const availability = useAvailability();

  const calendars = useMemo(
    () =>
      availability?.status === "live" && availability.cabins[cabin.id]
        ? [availability.cabins[cabin.id]]
        : null,
    [availability, cabin.id],
  );

  const datesTaken = !!calendars && !!checkIn && !!checkOut && !canStay(calendars, checkIn, checkOut);
  const ready = !!checkIn && !!checkOut && !datesTaken;
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  function handleSelectDate(date: Date) {
    if (checkIn && !checkOut && isAfter(date, checkIn)) {
      setCheckOut(date);
      setCalendarOpen(false);
      return;
    }
    setCheckIn(date);
    setCheckOut(null);
  }

  function clearDates() {
    setCheckIn(null);
    setCheckOut(null);
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-bark-800/10 sm:p-6">
      <div className="flex items-end justify-between gap-3">
        <p className="text-bark-600">
          <span className="block font-serif text-2xl text-bark-800">Rates vary by date</span>
          <span className="block text-xs">+ ${cabin.cleaningFee} cleaning fee</span>
        </p>
        <p className="flex items-center gap-1 text-sm text-bark-600">
          <Star size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" className="text-caramel-500" />
          <span className="font-semibold text-bark-800">{formatRating(cabin.rating)}</span>({cabin.reviewCount})
        </p>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-stone-200">
        <button
          type="button"
          aria-expanded={calendarOpen}
          onClick={() => setCalendarOpen((open) => !open)}
          className="grid w-full grid-cols-2 divide-x divide-stone-200 text-left transition-colors hover:bg-stone-50"
        >
          {[
            { label: "Check-in", value: checkIn },
            { label: "Check-out", value: checkOut },
          ].map((field) => (
            <span key={field.label} className="flex min-w-0 items-center gap-2 p-3">
              <CalendarDays size={16} strokeWidth={1.75} className="shrink-0 text-pine-600" />
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-bark-600">
                  {field.label}
                </span>
                <span className="block truncate text-sm font-medium text-bark-800">
                  {field.value ? formatDisplayDate(field.value) : "Add date"}
                </span>
              </span>
            </span>
          ))}
        </button>

        {calendarOpen && (
          <div className="border-t border-stone-200 p-3">
            <DateRangeCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              calendars={calendars}
              singleMonth
              onSelect={handleSelectDate}
              onClear={clearDates}
              onDone={() => setCalendarOpen(false)}
            />
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-stone-200 p-3">
          <Users size={16} strokeWidth={1.75} className="shrink-0 text-pine-600" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-bark-600">Guests</span>
            <span className="block text-sm font-medium text-bark-800" aria-live="polite">
              {guests} of {cabin.guests}
            </span>
          </span>
          <button
            type="button"
            aria-label="Decrease guests"
            className={stepper}
            disabled={guests <= 1}
            onClick={() => setGuests(guests - 1)}
          >
            <Minus size={14} />
          </button>
          <button
            type="button"
            aria-label="Increase guests"
            className={stepper}
            disabled={guests >= cabin.guests}
            onClick={() => setGuests(guests + 1)}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {datesTaken && (
        <p className="mt-3 rounded-xl bg-stone-50 px-3 py-2 text-xs text-bark-600">
          Those dates aren&rsquo;t available here. Please choose different dates.
        </p>
      )}
      {ready && (
        <p className="mt-3 text-center text-sm font-medium text-bark-800">
          {nights} {nights === 1 ? "night" : "nights"} at {cabin.name}
        </p>
      )}

      {ready ? (
        <a
          href={guestyBookingUrl(cabin.id, { checkIn: toISODate(checkIn), checkOut: toISODate(checkOut), guests })}
          className="mt-4 block w-full rounded-full bg-pine-600 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-forest-800"
        >
          Book Now
        </a>
      ) : (
        <button
          type="button"
          onClick={() => setCalendarOpen(true)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-pine-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-forest-800"
        >
          Select dates
          <ChevronDown size={16} />
        </button>
      )}
    </div>
  );
}
