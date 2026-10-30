import { cabins } from "@/lib/data/cabins";
import type { CabinCalendar } from "@/lib/availability";
import { addDays, toISODate } from "@/lib/date";

const TOKEN_URL = "https://booking.guesty.com/oauth2/token";
const API_BASE = process.env.GUESTY_API_BASE ?? "https://booking.guesty.com/api";
const CALENDAR_DAYS = 540;
const CALENDAR_REVALIDATE_SECONDS = 900;

interface GuestyCalendarDay {
  date: string;
  status: string;
  minNights: number;
  cta?: boolean;
  ctd?: boolean;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

export function isGuestyConfigured() {
  return Boolean(process.env.GUESTY_CLIENT_ID && process.env.GUESTY_CLIENT_SECRET);
}

// Guesty limits how often tokens can be issued, so reuse one until just before it expires.
async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "booking_engine:api",
      client_id: process.env.GUESTY_CLIENT_ID ?? "",
      client_secret: process.env.GUESTY_CLIENT_SECRET ?? "",
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Guesty token request failed: ${res.status}`);

  const { access_token, expires_in } = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  cachedToken = { value: access_token, expiresAt: Date.now() + (expires_in - 300) * 1000 };
  return access_token;
}

async function getCabinCalendar(id: string, token: string): Promise<CabinCalendar> {
  const today = new Date();
  const params = new URLSearchParams({
    from: toISODate(today),
    to: toISODate(addDays(today, CALENDAR_DAYS)),
  });

  const res = await fetch(`${API_BASE}/listings/${id}/calendar?${params}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    next: { revalidate: CALENDAR_REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`Guesty calendar request failed: ${res.status}`);

  const days = (await res.json()) as GuestyCalendarDay[];
  return Object.fromEntries(
    days.map((day) => [
      day.date,
      {
        available: day.status === "available",
        minNights: day.minNights,
        noCheckIn: !!day.cta,
        noCheckOut: !!day.ctd,
      },
    ]),
  );
}

export async function getAvailability(): Promise<Record<string, CabinCalendar>> {
  const token = await getToken();
  const entries = await Promise.all(
    cabins.map(async (cabin) => [cabin.id, await getCabinCalendar(cabin.id, token)] as const),
  );
  return Object.fromEntries(entries);
}
