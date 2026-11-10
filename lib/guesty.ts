import { cabins } from "@/lib/data/cabins";
import type { CabinCalendar } from "@/lib/availability";
import { addDays, toISODate } from "@/lib/date";

const CALENDAR_DAYS = 540;
// Guesty publishes these feeds with a one-hour TTL and can lag behind bookings anyway.
const FEED_REVALIDATE_SECONDS = 900;

// Each feed URL also exposes guests' reservation codes, so the links stay in server-only env vars.
const feedEnv: Record<string, string> = {
  "bluff-ridge-haven": "GUESTY_ICAL_BLUFF_RIDGE_HAVEN",
  "pine-top-vista": "GUESTY_ICAL_PINE_TOP_VISTA",
  "cabana-on-osprey": "GUESTY_ICAL_CABANA_ON_OSPREY",
};

function feedUrl(slug: string) {
  return process.env[feedEnv[slug]];
}

export function isGuestyConfigured() {
  return cabins.every((cabin) => Boolean(feedUrl(cabin.slug)));
}

/** yyyymmdd from a DTSTART/DTEND value, whether it's a date or a date-time. */
function icalDate(value: string) {
  const match = /^(\d{4})(\d{2})(\d{2})/.exec(value);
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
}

/**
 * Nights blocked by each event in an iCal feed. DTEND is the check-out day and
 * is exclusive, so a guest can arrive the morning another leaves.
 */
function blockedNights(ics: string) {
  const unfolded = ics.replace(/\r?\n[ \t]/g, "");
  const blocked = new Set<string>();

  for (const event of unfolded.split("BEGIN:VEVENT").slice(1)) {
    const start = icalDate(/^DTSTART[^:]*:(.+)$/m.exec(event)?.[1] ?? "");
    if (!start) continue;
    const end = icalDate(/^DTEND[^:]*:(.+)$/m.exec(event)?.[1] ?? "") ?? addDays(start, 1);

    for (let night = start; night < end; night = addDays(night, 1)) {
      blocked.add(toISODate(night));
    }
  }

  return blocked;
}

async function getCabinCalendar(slug: string, minNights: number): Promise<CabinCalendar> {
  const res = await fetch(feedUrl(slug)!, { next: { revalidate: FEED_REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`Guesty calendar feed for ${slug} failed: ${res.status}`);

  const ics = await res.text();
  if (!ics.includes("BEGIN:VCALENDAR")) throw new Error(`Guesty calendar feed for ${slug} isn't iCal`);

  const blocked = blockedNights(ics);
  const calendar: CabinCalendar = {};
  // Starts a day back so "today" is covered whatever the server's time zone.
  for (let day = addDays(new Date(), -1), i = 0; i <= CALENDAR_DAYS; day = addDays(day, 1), i++) {
    const iso = toISODate(day);
    calendar[iso] = { available: !blocked.has(iso), minNights, noCheckIn: false, noCheckOut: false };
  }
  return calendar;
}

/**
 * Throws if any feed fails: a missing cabin would make its free dates look
 * booked, which is worse than showing no availability at all.
 */
export async function getAvailability(): Promise<Record<string, CabinCalendar>> {
  const entries = await Promise.all(
    cabins.map(async (cabin) => [cabin.id, await getCabinCalendar(cabin.slug, cabin.minNights)] as const),
  );
  return Object.fromEntries(entries);
}
