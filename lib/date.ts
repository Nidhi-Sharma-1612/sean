export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isAfter(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

/** Whole nights between two dates (b after a), ignoring time of day. */
export function nightsBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000);
}

/** Builds a 6-week grid for the given month, padded with adjacent-month days. */
export function buildMonthGrid(year: number, month: number): CalendarDay[][] {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const gridStart = addDays(firstOfMonth, -startWeekday);

  const weeks: CalendarDay[][] = [];
  let cursor = gridStart;

  for (let week = 0; week < 6; week++) {
    const days: CalendarDay[] = [];
    for (let day = 0; day < 7; day++) {
      days.push({ date: cursor, isCurrentMonth: cursor.getMonth() === month });
      cursor = addDays(cursor, 1);
    }
    weeks.push(days);
  }

  return weeks;
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Local (not UTC) yyyy-mm-dd, safe for use in URL search params. */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parses yyyy-mm-dd as a local date; `new Date(iso)` would read it as UTC and can shift a day. */
export function parseISODate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}
