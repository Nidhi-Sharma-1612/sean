"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Home,
  Minus,
  Mountain,
  Plus,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import DateRangeCalendar from "@/components/DateRangeCalendar";
import { canCheckIn, canStay, type AvailabilityResponse, type CabinCalendar } from "@/lib/availability";
import { cabins, findCabin, maxGuests } from "@/lib/data/cabins";
import { formatDisplayDate, isAfter, parseISODate, toISODate } from "@/lib/date";
import { cabinsUrl, type StaySearch } from "@/lib/search";
import { useAvailability } from "@/lib/useAvailability";

type Panel = "dates" | "cabin" | "guests";

const panelClass =
  "absolute inset-x-0 top-full z-30 mx-auto mt-3 rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-bark-800/10";
const stepper =
  "flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-bark-600 transition-colors hover:border-pine-600 hover:text-pine-600 disabled:opacity-30";

function Field({
  icon: Icon,
  label,
  value,
  active,
  chevron = false,
  className = "",
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  active: boolean;
  chevron?: boolean;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={active}
      onClick={onClick}
      className={[
        "flex min-w-0 flex-1 items-center gap-2.5 rounded-full px-3 py-2 text-left transition-colors sm:gap-3 sm:px-5 sm:py-3",
        active ? "bg-pine-600/10" : "hover:bg-stone-50",
        className,
      ].join(" ")}
    >
      <Icon size={18} strokeWidth={1.75} className="shrink-0 text-pine-600" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-bark-600">{label}</span>
        <span className="truncate text-sm font-medium text-bark-800">{value}</span>
      </span>
      {chevron && (
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={`shrink-0 text-bark-600 transition-transform ${active ? "rotate-180" : ""}`}
        />
      )}
    </button>
  );
}

export default function BookingWidget({ initial = {} }: { initial?: StaySearch }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(() => parseISODate(initial.checkIn ?? ""));
  const [checkOut, setCheckOut] = useState(() => parseISODate(initial.checkOut ?? ""));
  const [guests, setGuests] = useState(initial.guests ?? 2);
  const [cabinId, setCabinId] = useState(() => findCabin(initial.cabin)?.id ?? "");
  const [panel, setPanel] = useState<Panel | null>(null);
  const availability = useAvailability();
  const [datesCleared, setDatesCleared] = useState(false);

  const widgetRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const selectedCabin = cabins.find((cabin) => cabin.id === cabinId);
  const guestLimit = selectedCabin?.guests ?? maxGuests;

  const calendars = useMemo(
    () => calendarsFor(availability, cabinId, guests),
    [availability, cabinId, guests],
  );

  useEffect(() => {
    if (!panel) return;

    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setPanel(null);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setPanel(null);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [panel]);

  // The widget sits low on phones, so bring the open panel fully on screen.
  useEffect(() => {
    if (panel) panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [panel]);

  function togglePanel(next: Panel) {
    setPanel((current) => (current === next ? null : next));
  }

  /** Drops dates that no longer work after the cabin or guest count changes. */
  function revalidateDates(nextCabinId: string, nextGuests: number) {
    const nextCalendars = calendarsFor(availability, nextCabinId, nextGuests);
    if (!nextCalendars || !checkIn) return;

    const stillValid = checkOut
      ? canStay(nextCalendars, checkIn, checkOut)
      : canCheckIn(nextCalendars, checkIn);
    if (stillValid) return;

    handleClearDates();
    setDatesCleared(true);
    setPanel("dates");
  }

  function handleSelectDate(date: Date) {
    setDatesCleared(false);

    if (checkIn && !checkOut && isAfter(date, checkIn)) {
      setCheckOut(date);
      setPanel(null);
      return;
    }

    setCheckIn(date);
    setCheckOut(null);
  }

  function handleClearDates() {
    setCheckIn(null);
    setCheckOut(null);
    setDatesCleared(false);
  }

  function handleCabinChange(id: string) {
    const limit = cabins.find((cabin) => cabin.id === id)?.guests ?? maxGuests;
    const nextGuests = Math.min(guests, limit);

    setCabinId(id);
    setGuests(nextGuests);
    revalidateDates(id, nextGuests);
  }

  function handleGuestsChange(next: number) {
    setGuests(next);
    revalidateDates(cabinId, next);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (checkIn && !checkOut) {
      setPanel("dates");
      return;
    }

    setPanel(null);
    router.push(
      cabinsUrl({
        cabin: selectedCabin?.slug,
        checkIn: checkIn ? toISODate(checkIn) : undefined,
        checkOut: checkOut ? toISODate(checkOut) : undefined,
        guests,
      }),
    );
  }

  const calendarNote = datesCleared
    ? "Those dates aren't available with your new selection. Please choose new dates."
    : null;

  return (
    <form
      ref={widgetRef}
      onSubmit={handleSubmit}
      className="relative grid grid-cols-2 gap-1 rounded-4xl bg-white p-3 text-left shadow-[0_24px_60px_-15px_rgba(22,38,29,0.55)] lg:flex lg:items-stretch lg:rounded-full"
    >
      <Field
        icon={CalendarDays}
        label="Check-in"
        value={checkIn ? formatDisplayDate(checkIn) : "Add date"}
        active={panel === "dates"}
        onClick={() => togglePanel("dates")}
      />
      <Field
        icon={CalendarDays}
        label="Check-out"
        value={checkOut ? formatDisplayDate(checkOut) : "Add date"}
        active={panel === "dates"}
        onClick={() => togglePanel("dates")}
      />
      <Field
        icon={Home}
        label="Cabin"
        value={selectedCabin?.name ?? "Any cabin"}
        active={panel === "cabin"}
        chevron
        className="col-span-2 sm:col-span-1"
        onClick={() => togglePanel("cabin")}
      />
      <Field
        icon={Users}
        label="Guests"
        value={`${guests} guest${guests > 1 ? "s" : ""}`}
        active={panel === "guests"}
        chevron
        className="col-span-2 sm:col-span-1"
        onClick={() => togglePanel("guests")}
      />

      <button
        type="submit"
        className="col-span-2 mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-pine-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-forest-800 lg:mt-0 lg:ml-2"
      >
        <Search size={16} strokeWidth={2} />
        <span className="whitespace-nowrap">Check Availability</span>
      </button>

      <AnimatePresence>
        {panel && (
          <motion.div
            key={panel}
            ref={panelRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className={`${panelClass} ${panel === "dates" ? "max-w-xl" : "max-w-sm"}`}
          >
            {panel === "dates" && (
              <DateRangeCalendar
                checkIn={checkIn}
                checkOut={checkOut}
                calendars={calendars}
                note={calendarNote}
                onSelect={handleSelectDate}
                onClear={handleClearDates}
                onDone={() => setPanel(null)}
              />
            )}

            {panel === "cabin" && (
              <div className="flex flex-col gap-1" role="group" aria-label="Choose a cabin">
                <CabinOption
                  name="Any cabin"
                  detail="See what's open across all three"
                  selected={!cabinId}
                  onSelect={() => {
                    handleCabinChange("");
                    setPanel((current) => (current === "cabin" ? null : current));
                  }}
                />
                {cabins.map((cabin) => (
                  <CabinOption
                    key={cabin.id}
                    name={cabin.name}
                    detail={`${cabin.town} · Sleeps ${cabin.guests}`}
                    image={cabin.photos[0].src}
                    selected={cabin.id === cabinId}
                    onSelect={() => {
                      handleCabinChange(cabin.id);
                      setPanel((current) => (current === "cabin" ? null : current));
                    }}
                  />
                ))}
              </div>
            )}

            {panel === "guests" && (
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-bark-800">Guests</p>
                    <p className="text-xs text-bark-600">
                      {selectedCabin
                        ? `${selectedCabin.name} sleeps up to ${guestLimit}`
                        : `Our cabins sleep up to ${guestLimit}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Decrease guests"
                      className={stepper}
                      disabled={guests <= 1}
                      onClick={() => handleGuestsChange(guests - 1)}
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-bark-800" aria-live="polite">
                      {guests}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase guests"
                      className={stepper}
                      disabled={guests >= guestLimit}
                      onClick={() => handleGuestsChange(guests + 1)}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPanel(null)}
                  className="mt-4 w-full rounded-full bg-pine-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-800"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function calendarsFor(
  availability: AvailabilityResponse | null,
  cabinId: string,
  guests: number,
): CabinCalendar[] | null {
  if (availability?.status !== "live") return null;

  const { cabins: live } = availability;
  const eligible = cabinId
    ? cabins.filter((cabin) => cabin.id === cabinId)
    : cabins.filter((cabin) => cabin.guests >= guests);
  return eligible.flatMap((cabin) => (live[cabin.id] ? [live[cabin.id]] : []));
}

function CabinOption({
  name,
  detail,
  image,
  selected,
  onSelect,
}: {
  name: string;
  detail: string;
  image?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex items-center gap-3 rounded-2xl p-2 text-left transition-colors ${selected ? "bg-pine-600/10" : "hover:bg-stone-50"}`}
    >
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-pine-600/10 text-pine-600">
        {image ? <Image src={image} alt="" fill sizes="48px" className="object-cover" /> : <Mountain size={20} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-bark-800">{name}</span>
        <span className="block text-xs text-bark-600">{detail}</span>
      </span>
      {selected && <Check size={16} className="shrink-0 text-pine-600" />}
    </button>
  );
}
