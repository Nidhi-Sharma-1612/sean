import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Ban, ChevronRight, Clock, MapPin, PawPrint, PartyPopper, Star, Users, UserCheck, type LucideIcon } from "lucide-react";
import AmenitiesList from "@/components/AmenitiesList";
import BookingCard from "@/components/BookingCard";
import CabinCard, { formatRating } from "@/components/CabinCard";
import CabinPhotos from "@/components/CabinPhotos";
import ExpandableText from "@/components/ExpandableText";
import MobileBookBar from "@/components/MobileBookBar";
import details from "@/lib/data/cabin-details.json";
import { cabins, findCabin } from "@/lib/data/cabins";
import { nearbyPlaces } from "@/lib/data/nearby";
import { parseSearch } from "@/lib/search";

type DetailSlug = keyof typeof details;

interface RuleLine {
  level: number;
  text: string;
}

export function generateStaticParams() {
  return cabins.map((cabin) => ({ slug: cabin.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cabins/[slug]">): Promise<Metadata> {
  const cabin = findCabin((await params).slug);
  if (!cabin) return {};

  return {
    title: `${cabin.name}, ${cabin.town}`,
    description: cabin.summary,
    openGraph: { images: [{ url: cabin.photos[0].src }] },
  };
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function Rules({ lines }: { lines: RuleLine[] }) {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-bark-600">
      {lines.map((line, i) => {
        if (line.level === 0) {
          return (
            <h4 key={i} className="pt-3 font-serif text-lg text-bark-800 first:pt-0">
              {line.text}
            </h4>
          );
        }
        if (line.level === 3) return <p key={i}>{line.text}</p>;
        return (
          <p key={i} className={`relative ${line.level === 1 ? "pl-4" : "pl-8"}`}>
            <span aria-hidden="true" className={`absolute top-2.5 h-1 w-1 rounded-full bg-pine-600 ${line.level === 1 ? "left-1" : "left-5"}`} />
            {line.text}
          </p>
        );
      })}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-stone-200 py-10">
      <h2 className="font-serif text-2xl text-bark-800 sm:text-3xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function CabinPage({ params, searchParams }: PageProps<"/cabins/[slug]">) {
  const { slug } = await params;
  const cabin = findCabin(slug);
  if (!cabin) notFound();

  const search = parseSearch(await searchParams);
  const detail = details[slug as DetailSlug];
  const others = cabins.filter((item) => item.id !== cabin.id);

  const facts = [
    { icon: Users, label: `Sleeps ${cabin.guests}` },
    { icon: BedDouble, label: `${cabin.bedrooms} bedrooms` },
    { icon: BedDouble, label: `${detail.beds} beds` },
    { icon: Bath, label: `${cabin.bathrooms} baths` },
  ];

  const essentials: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Clock, label: "Check-in", value: `After ${formatTime(detail.checkIn)}` },
    { icon: Clock, label: "Check-out", value: `Before ${formatTime(detail.checkOut)}` },
    { icon: UserCheck, label: "Booking age", value: "25 or older" },
    { icon: PawPrint, label: "Pets", value: detail.policies.pets ? "Allowed" : "Not allowed" },
    { icon: Ban, label: "Smoking", value: detail.policies.smoking ? "Allowed" : "Not allowed" },
    { icon: PartyPopper, label: "Events", value: detail.policies.events ? "Allowed" : "Not allowed" },
  ];

  return (
    <div className="pb-8 pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm text-bark-600">
          <Link href="/" className="hover:text-pine-600">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link href="/cabins" className="hover:text-pine-600">Cabins</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page" className="truncate font-medium text-bark-800">{cabin.name}</span>
        </nav>

        <CabinPhotos name={cabin.name} photos={detail.photos} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
          <div className="min-w-0">
            <p className="font-serif text-base italic text-caramel-700">{cabin.bestFor}</p>
            <h1 className="mt-1 font-serif text-4xl text-bark-800 sm:text-5xl">{cabin.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-bark-600">
              <span className="flex items-center gap-1.5">
                <MapPin size={15} aria-hidden="true" className="text-pine-600" />
                {cabin.town}, Tennessee
              </span>
              <span className="flex items-center gap-1">
                <Star size={15} fill="currentColor" strokeWidth={0} aria-hidden="true" className="text-caramel-500" />
                <span className="font-semibold text-bark-800">{formatRating(cabin.rating)}</span>
                ({cabin.reviewCount} reviews)
              </span>
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facts.map((fact) => (
                <li key={fact.label} className="flex items-center gap-2 rounded-2xl bg-stone-50 px-3 py-3 text-sm font-medium text-bark-800">
                  <fact.icon size={17} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-pine-600" />
                  {fact.label}
                </li>
              ))}
            </ul>

            <div className="mt-8 lg:hidden" id="book">
              <BookingCard cabin={cabin} initial={search} />
            </div>

            <div className="mt-10">
              <Section title="About this cabin">
                <ExpandableText paragraphs={detail.about} />
              </Section>

              <Section title="Amenities">
                <AmenitiesList amenities={detail.amenities} />
              </Section>

              <Section title="What's nearby">
                <ul className="divide-y divide-stone-200">
                  {nearbyPlaces[cabin.id].map((place) => (
                    <li key={place.name} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <span className="font-medium text-bark-800">{place.name}</span>
                      <span className="shrink-0 font-serif text-lg text-pine-600">{place.distance}</span>
                    </li>
                  ))}
                </ul>
                {detail.gettingThere && (
                  <details className="group mt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-pine-600">Getting there</summary>
                    <p className="mt-2 text-sm leading-relaxed text-bark-600">{detail.gettingThere}</p>
                    {detail.parking && <p className="mt-2 text-sm leading-relaxed text-bark-600">{detail.parking}</p>}
                  </details>
                )}
              </Section>

              <Section title="Good to know">
                <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {essentials.map((item) => (
                    <li key={item.label} className="rounded-2xl bg-stone-50 p-4">
                      <item.icon size={18} strokeWidth={1.75} aria-hidden="true" className="text-pine-600" />
                      <p className="mt-2 text-xs text-bark-600">{item.label}</p>
                      <p className="text-sm font-semibold text-bark-800">{item.value}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 divide-y divide-stone-200 rounded-2xl ring-1 ring-stone-200">
                  <details className="p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-bark-800">House rules &amp; rental agreement</summary>
                    <div className="mt-4">
                      <Rules lines={detail.rules.slice(detail.rules[0].text.startsWith("The cabin") ? 1 : 0)} />
                    </div>
                  </details>
                  {detail.notes.length > 0 && (
                    <details className="p-4">
                      <summary className="cursor-pointer text-sm font-semibold text-bark-800">Notices from the owners</summary>
                      <div className="mt-3 space-y-3 text-sm leading-relaxed text-bark-600">
                        {detail.notes.map((note) => (
                          <p key={note}>{note}</p>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </Section>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div id="book-desktop" className="sticky top-24 -m-3 max-h-[calc(100dvh-6.5rem)] overflow-y-auto p-3">
              <BookingCard cabin={cabin} initial={search} />
            </div>
          </aside>
        </div>

        <section className="border-t border-stone-200 py-12">
          <h2 className="font-serif text-2xl text-bark-800 sm:text-3xl">More cabins you might like</h2>
          <div className="mx-auto mt-6 grid max-w-xl gap-6 lg:max-w-none lg:grid-cols-2">
            {others.map((other) => (
              <CabinCard key={other.id} cabin={other} search={{ ...search, cabin: undefined }} />
            ))}
          </div>
        </section>
      </div>

      <MobileBookBar price={cabin.nightlyFrom} />
    </div>
  );
}
