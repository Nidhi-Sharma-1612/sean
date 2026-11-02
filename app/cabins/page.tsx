import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import BookingWidget from "@/components/BookingWidget";
import CabinCard from "@/components/CabinCard";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { canStay, type CabinCalendar } from "@/lib/availability";
import { cabins, findCabin } from "@/lib/data/cabins";
import { formatDisplayDate, parseISODate } from "@/lib/date";
import { getAvailability, isGuestyConfigured } from "@/lib/guesty";
import { photos } from "@/lib/photos";
import { parseSearch } from "@/lib/search";

export const metadata: Metadata = {
  title: "Our Cabins",
  description: "Browse and search our three Smoky Mountain cabins in Gatlinburg, Pigeon Forge and Sevierville.",
};

async function loadAvailability(): Promise<Record<string, CabinCalendar> | null> {
  if (!isGuestyConfigured()) return null;
  try {
    return await getAvailability();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function CabinsPage({ searchParams }: PageProps<"/cabins">) {
  const search = parseSearch(await searchParams);
  const selected = findCabin(search.cabin);
  const checkIn = parseISODate(search.checkIn ?? "");
  const checkOut = parseISODate(search.checkOut ?? "");
  const live = checkIn && checkOut ? await loadAvailability() : null;

  const results = cabins.filter((cabin) => {
    if (selected && cabin.id !== selected.id) return false;
    if (search.guests && cabin.guests < search.guests) return false;
    if (live && checkIn && checkOut) {
      return live[cabin.id] ? canStay([live[cabin.id]], checkIn, checkOut) : false;
    }
    return true;
  });

  const summary = [
    `${results.length} ${results.length === 1 ? "cabin" : "cabins"}`,
    checkIn && checkOut && `${formatDisplayDate(checkIn)} – ${formatDisplayDate(checkOut)}`,
    search.guests && `${search.guests} ${search.guests === 1 ? "guest" : "guests"}`,
  ]
    .filter(Boolean)
    .join(" · ");

  // Dates carry over to each cabin page; a one-cabin filter only applies to this list.
  const cardSearch = { ...search, cabin: undefined };

  return (
    <>
      <PageHero
        eyebrow="Our Cabins"
        title="Find your cabin in the Smokies"
        description="Three cabins, each cared for by their owners. Add your dates and group size to narrow things down."
        image={photos.pineTopFall}
        imageAlt="Aerial view of Pine Top Vista surrounded by autumn color"
      />

      <div className="relative z-20 mx-auto -mt-8 max-w-6xl px-4 sm:px-6">
        <BookingWidget key={JSON.stringify(search)} initial={search} />
      </div>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <p className="text-sm font-semibold text-bark-600" aria-live="polite">
          {summary}
        </p>

        {results.length > 0 ? (
          <div className="mx-auto mt-6 grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
            {results.map((cabin, i) => (
              <Reveal key={cabin.id} delay={i * 0.1} className="h-full">
                <CabinCard cabin={cabin} search={cardSearch} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-6 max-w-xl rounded-3xl bg-stone-50 p-10 text-center">
            <SearchX size={32} strokeWidth={1.5} className="mx-auto text-pine-600" />
            <h2 className="mt-4 font-serif text-2xl text-bark-800">No cabins match that search</h2>
            <p className="mt-2 text-sm text-bark-600">
              Try different dates or a smaller group, or get in touch and we&rsquo;ll help you find a fit.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/cabins"
                className="rounded-full bg-pine-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-800"
              >
                See all cabins
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-pine-600 px-6 py-3 text-sm font-semibold text-pine-600 transition-colors hover:bg-pine-600 hover:text-white"
              >
                Contact us
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
