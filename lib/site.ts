export const site = {
  name: "GSM Cabin Rentals",
  tagline: "Create memories today to last a lifetime",
  description:
    "Three owner-cared-for Smoky Mountain cabins in Gatlinburg, Pigeon Forge and Sevierville, with hot tubs, indoor pools, game rooms and big mountain views.",
  url: "https://www.gsmcabinrentals.com",
  email: "gsmcabinrentals@gmail.com",
  facebook: "https://www.facebook.com/GSMcabinrentals",
};

/**
 * Guesty's booking site, which takes payment. Move to e.g. https://book.gsmcabinrentals.com
 * once this site takes over www.gsmcabinrentals.com.
 */
const BOOKING_ORIGIN = process.env.NEXT_PUBLIC_BOOKING_ORIGIN ?? "https://www.gsmcabinrentals.com";

/**
 * Guesty's cabin page with the stay filled in; its "Book now" opens checkout.
 * Linking to /checkout directly doesn't work: without the quote Guesty creates
 * on this page, it falls back to search results.
 */
export function guestyBookingUrl(listingId: string, stay: { checkIn: string; checkOut: string; guests: number }) {
  const params = new URLSearchParams({
    minOccupancy: String(stay.guests),
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
    adults: String(stay.guests),
  });
  return `${BOOKING_ORIGIN}/en/properties/${listingId}?${params}`;
}

export const navLinks = [
  { href: "/cabins", label: "Cabins" },
  { href: "/#why", label: "Why GSM" },
  { href: "/#story", label: "Our Story" },
  { href: "/#explore", label: "Explore" },
  { href: "/contact", label: "Contact" },
];
