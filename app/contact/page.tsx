import type { Metadata } from "next";
import { CalendarDays, Mail, MapPin, Users } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { findCabin } from "@/lib/data/cabins";
import { formatDisplayDate, parseISODate } from "@/lib/date";
import { photos } from "@/lib/photos";
import { parseSearch } from "@/lib/search";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Questions about a cabin or ready to book? Get in touch with GSM Cabin Rentals.",
};

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.2v2.5H7.5v3.2h2.7V22h3.3Z" />
    </svg>
  );
}

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const search = parseSearch(await searchParams);
  const cabin = findCabin(search.cabin);
  const checkIn = parseISODate(search.checkIn ?? "");
  const checkOut = parseISODate(search.checkOut ?? "");
  const dates = checkIn && checkOut ? `${formatDisplayDate(checkIn)} – ${formatDisplayDate(checkOut)}` : "";
  const isBookingRequest = Boolean(cabin && dates);

  return (
    <>
      <PageHero
        eyebrow={isBookingRequest ? "Booking Request" : "Contact"}
        title={isBookingRequest ? `Request your stay at ${cabin?.name}` : "We'd love to hear from you"}
        description={
          isBookingRequest
            ? "Send us your details and we'll confirm availability and your total by email."
            : "Questions about a cabin, or ready to plan your trip? Send us a note."
        }
        image={photos.smokiesCreek}
        imageAlt="Mountain stream running through green forest"
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
        <ContactForm cabin={cabin?.name} dates={dates} guests={search.guests ? String(search.guests) : undefined} />

        <aside className="space-y-4">
          {isBookingRequest && (
            <div className="rounded-3xl bg-forest-800 p-6 text-white">
              <h2 className="font-serif text-xl">{cabin?.name}</h2>
              <ul className="mt-3 space-y-2 text-sm text-white/90">
                <li className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-caramel-300" /> {dates}
                </li>
                {search.guests && (
                  <li className="flex items-center gap-2">
                    <Users size={16} className="text-caramel-300" /> {search.guests} guests
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="rounded-3xl bg-stone-50 p-6">
            <h2 className="font-serif text-xl text-bark-800">Get in touch</h2>
            <ul className="mt-4 space-y-3 text-sm text-bark-600">
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 break-all hover:text-pine-600">
                  <Mail size={18} className="shrink-0 text-pine-600" />
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-pine-600">
                  <span className="shrink-0 text-pine-600"><FacebookIcon /></span>
                  Follow us on Facebook
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={18} className="shrink-0 text-pine-600" />
                Great Smoky Mountains, Tennessee
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
