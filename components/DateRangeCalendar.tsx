"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { canCheckIn, canStay, isOpen, minimumStay, type CabinCalendar } from "@/lib/availability";
import {
  addMonths,
  buildMonthGrid,
  formatDisplayDate,
  formatMonthYear,
  isAfter,
  isBefore,
  isSameDay,
  nightsBetween,
  startOfDay,
  type CalendarDay,
} from "@/lib/date";

const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface RangeState {
  checkIn: Date | null;
  checkOut: Date | null;
  rangeEnd: Date | null;
  /** Null until live availability is connected: every future date is selectable. */
  calendars: CabinCalendar[] | null;
}

export default function DateRangeCalendar({
  checkIn,
  checkOut,
  calendars,
  note,
  singleMonth = false,
  onSelect,
  onClear,
  onDone,
}: {
  checkIn: Date | null;
  checkOut: Date | null;
  calendars: CabinCalendar[] | null;
  note?: string | null;
  singleMonth?: boolean;
  onSelect: (date: Date) => void;
  onClear: () => void;
  onDone: () => void;
}) {
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(() => addMonths(checkIn ?? today, 0));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const canGoBack = isAfter(viewMonth, today);

  const previewEnd =
    checkIn &&
    !checkOut &&
    hoverDate &&
    isAfter(hoverDate, checkIn) &&
    (!calendars || canStay(calendars, checkIn, hoverDate))
      ? hoverDate
      : null;
  const range = { checkIn, checkOut, rangeEnd: checkOut ?? previewEnd, calendars };

  const minNights = checkIn && calendars ? minimumStay(calendars, checkIn) : 1;
  const prompt =
    checkIn && checkOut
      ? `${formatDisplayDate(checkIn)} – ${formatDisplayDate(checkOut)} · ${nightsBetween(checkIn, checkOut)} nights`
      : checkIn
        ? `Now choose check-out${minNights > 1 ? ` · ${minNights}-night minimum` : ""}`
        : "Choose your check-in date";

  function renderMonth(monthDate: Date) {
    const weeks = buildMonthGrid(monthDate.getFullYear(), monthDate.getMonth()).filter((week) =>
      week.some((day) => day.isCurrentMonth),
    );

    return (
      <div className="flex-1">
        <p className="text-center font-serif text-sm text-bark-800">{formatMonthYear(monthDate)}</p>

        <div className="mt-2 grid grid-cols-7 text-center text-[10px] font-semibold text-bark-600">
          {weekdayLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-y-0.5">
          {weeks.flat().map((day, dayIdx) => (
            <DayCell
              key={dayIdx}
              day={day}
              today={today}
              range={range}
              onSelect={onSelect}
              onHover={setHoverDate}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div onMouseLeave={() => setHoverDate(null)}>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setViewMonth((m) => addMonths(m, -1))}
          disabled={!canGoBack}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-bark-600 transition-colors hover:bg-stone-50 disabled:invisible"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-center text-xs font-semibold text-pine-600" aria-live="polite">
          {prompt}
        </p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-bark-600 transition-colors hover:bg-stone-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className={`mt-1 flex flex-col gap-4 ${singleMonth ? "" : "md:flex-row md:gap-6"}`}>
        {renderMonth(viewMonth)}
        {!singleMonth && <div className="hidden flex-1 md:block">{renderMonth(addMonths(viewMonth, 1))}</div>}
      </div>

      {note && <p className="mt-2 rounded-lg bg-stone-50 px-3 py-1.5 text-[11px] text-bark-600">{note}</p>}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 pt-2.5">
        {calendars ? (
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-bark-600">
            <span className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded bg-pine-600/20" /> Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-stone-200 text-[9px] leading-none text-bark-600 line-through">
                8
              </span>
              Booked or unavailable
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded bg-pine-600" /> Your stay
            </span>
          </div>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-bark-600 underline-offset-2 hover:underline"
          >
            Clear dates
          </button>
          <button
            type="button"
            onClick={onDone}
            className="rounded-full bg-pine-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-forest-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function DayCell({
  day,
  today,
  range: { checkIn, checkOut, rangeEnd, calendars },
  onSelect,
  onHover,
}: {
  day: CalendarDay;
  today: Date;
  range: RangeState;
  onSelect: (date: Date) => void;
  onHover: (date: Date | null) => void;
}) {
  const { date, isCurrentMonth } = day;
  if (!isCurrentMonth) return <span aria-hidden="true" />;

  const isPast = isBefore(date, today);
  const isCheckoutCandidate = !!checkIn && !checkOut && isAfter(date, checkIn);

  const open = !calendars || isOpen(calendars, date);
  const selectable =
    !isPast &&
    (!calendars ||
      (isCheckoutCandidate ? canStay(calendars, checkIn, date) : canCheckIn(calendars, date)));
  const booked = !isPast && !open && !selectable;
  const checkoutOnly = selectable && !open;

  const isStart = isSameDay(date, checkIn);
  const isEnd = isSameDay(date, rangeEnd);
  const inRange = !!checkIn && !!rangeEnd && isAfter(date, checkIn) && isBefore(date, rangeEnd);

  const reason = booked
    ? "Booked or unavailable"
    : checkoutOnly
      ? "Check-out only"
      : !selectable && !isPast
        ? isCheckoutCandidate
          ? "Not available for this stay"
          : "No check-in this day"
        : null;

  return (
    <button
      type="button"
      disabled={!selectable}
      title={reason ?? undefined}
      aria-label={`${date.toDateString()}${reason ? `, ${reason}` : ""}`}
      aria-pressed={isStart || isEnd}
      onClick={() => onSelect(date)}
      onMouseEnter={() => onHover(date)}
      onFocus={() => onHover(date)}
      className={[
        "h-8 w-full text-xs transition-colors",
        isStart || isEnd
          ? "z-10 rounded-lg bg-pine-600 font-semibold text-white"
          : inRange
            ? "bg-pine-600/35 font-semibold text-forest-800"
            : booked
              ? "cursor-not-allowed rounded-lg bg-stone-200/70 text-bark-600/60 line-through"
              : !selectable
                ? "cursor-not-allowed text-bark-800/25"
                : calendars
                  ? "rounded-lg bg-pine-600/20 font-semibold text-forest-800 hover:bg-pine-600/35"
                  : "rounded-lg font-medium text-bark-800 hover:bg-stone-50",
      ].join(" ")}
    >
      {date.getDate()}
    </button>
  );
}
