import { addDays, nightsBetween, toISODate } from "@/lib/date";

export interface DayAvailability {
  available: boolean;
  minNights: number;
  noCheckIn: boolean;
  noCheckOut: boolean;
}

/** One cabin's days, keyed by yyyy-mm-dd. */
export type CabinCalendar = Record<string, DayAvailability>;

export type AvailabilityResponse =
  | { status: "live"; cabins: Record<string, CabinCalendar> }
  | { status: "not-configured" | "error" };

export function isOpen(calendars: CabinCalendar[], date: Date): boolean {
  return calendars.some((calendar) => calendar[toISODate(date)]?.available);
}

function cabinAllowsCheckIn(calendar: CabinCalendar, date: Date): boolean {
  const day = calendar[toISODate(date)];
  return !!day && day.available && !day.noCheckIn;
}

export function canCheckIn(calendars: CabinCalendar[], date: Date): boolean {
  return calendars.some((calendar) => cabinAllowsCheckIn(calendar, date));
}

/** Lowest minimum stay among the cabins taking a check-in that day. */
export function minimumStay(calendars: CabinCalendar[], date: Date): number {
  const iso = toISODate(date);
  const open = calendars.filter((calendar) => cabinAllowsCheckIn(calendar, date));
  return open.length > 0 ? Math.min(...open.map((calendar) => calendar[iso].minNights)) : 1;
}

/**
 * Whether one single cabin can take the whole stay. The check-out date's own
 * status doesn't matter beyond its check-out rule: that morning can be another
 * guest's same-day check-in.
 */
export function canStay(calendars: CabinCalendar[], checkIn: Date, checkOut: Date): boolean {
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) return false;

  return calendars.some((calendar) => {
    if (!cabinAllowsCheckIn(calendar, checkIn)) return false;
    if (nights < calendar[toISODate(checkIn)].minNights) return false;
    if (calendar[toISODate(checkOut)]?.noCheckOut) return false;

    for (let i = 0; i < nights; i++) {
      if (!calendar[toISODate(addDays(checkIn, i))]?.available) return false;
    }
    return true;
  });
}
