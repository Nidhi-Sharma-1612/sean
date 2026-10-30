/**
 * Bookings stay on GSM's Guesty engine. If the marketing site takes over
 * www.gsmcabinrentals.com, point this at the host the engine moves to.
 */
export const BOOKING_ORIGIN = "https://www.gsmcabinrentals.com";

export const site = {
  name: "GSM Cabin Rentals",
  tagline: "Create memories today to last a lifetime",
  description:
    "Three owner-cared-for Smoky Mountain cabins in Gatlinburg, Pigeon Forge and Sevierville, with hot tubs, indoor pools, game rooms and big mountain views.",
  url: "https://www.gsmcabinrentals.com",
  email: "gsmcabinrentals@gmail.com",
  facebook: "https://www.facebook.com/GSMcabinrentals",
};

export const navLinks = [
  { href: "#cabins", label: "Cabins" },
  { href: "#why", label: "Why GSM" },
  { href: "#story", label: "Our Story" },
  { href: "#explore", label: "Explore" },
  { href: "#contact", label: "Contact" },
];

export interface BookingSearch {
  cabinId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

/** Guesty listing or search URL, with the parameters its engine reads. */
export function bookingUrl({ cabinId, checkIn, checkOut, guests }: BookingSearch = {}): string {
  const params = new URLSearchParams();
  if (checkIn && checkOut) {
    params.set("checkIn", checkIn);
    params.set("checkOut", checkOut);
  }
  if (guests) params.set("minOccupancy", String(guests));

  const path = cabinId ? `/en/properties/${cabinId}` : "/en/properties";
  const query = params.toString();
  return `${BOOKING_ORIGIN}${path}${query ? `?${query}` : ""}`;
}
