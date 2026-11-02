import { parseISODate, startOfDay } from "@/lib/date";

export interface StaySearch {
  cabin?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

type RawParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** Reads a search from URL params, dropping anything malformed or in the past. */
export function parseSearch(params: RawParams): StaySearch {
  const search: StaySearch = {};

  const cabin = one(params.cabin);
  if (cabin) search.cabin = cabin;

  const guests = Number(one(params.guests));
  if (Number.isInteger(guests) && guests > 0) search.guests = guests;

  const checkIn = parseISODate(one(params.checkIn) ?? "");
  const checkOut = parseISODate(one(params.checkOut) ?? "");
  if (checkIn && checkOut && checkOut > checkIn && checkIn >= startOfDay(new Date())) {
    search.checkIn = one(params.checkIn);
    search.checkOut = one(params.checkOut);
  }

  return search;
}

function toQuery({ cabin, checkIn, checkOut, guests }: StaySearch) {
  const params = new URLSearchParams();
  if (cabin) params.set("cabin", cabin);
  if (checkIn && checkOut) {
    params.set("checkIn", checkIn);
    params.set("checkOut", checkOut);
  }
  if (guests) params.set("guests", String(guests));

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function cabinsUrl(search: StaySearch = {}) {
  return `/cabins${toQuery(search)}`;
}

export function cabinUrl(slug: string, search: StaySearch = {}) {
  return `/cabins/${slug}${toQuery({ ...search, cabin: undefined })}`;
}
