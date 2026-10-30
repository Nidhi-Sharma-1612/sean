import { ArrowRight, Bath, BedDouble, Check, MapPin, Star, Users } from "lucide-react";
import CabinGallery from "@/components/CabinGallery";
import type { Cabin } from "@/lib/data/cabins";
import { bookingUrl } from "@/lib/site";

function formatRating(rating: number) {
  return rating.toFixed(2).replace(/0$/, "");
}

export default function CabinCard({ cabin }: { cabin: Cabin }) {
  const href = bookingUrl({ cabinId: cabin.id });
  const facts = [
    { icon: BedDouble, value: cabin.bedrooms, label: "Bedrooms" },
    { icon: Bath, value: cabin.bathrooms, label: "Baths" },
    { icon: Users, value: cabin.guests, label: "Sleeps" },
  ];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-bark-800/10 transition-shadow duration-300 hover:shadow-xl">
      <div className="relative">
        <CabinGallery name={cabin.name} photos={cabin.photos} />
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-forest-800 px-3 py-1 text-xs font-semibold text-white">
          {cabin.bestFor}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3 text-sm text-bark-600">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} aria-hidden="true" className="text-pine-600" />
            {cabin.town}, TN
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Star size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" className="text-caramel-500" />
            <span className="font-semibold text-bark-800">{formatRating(cabin.rating)}</span>
            ({cabin.reviewCount})
          </span>
        </div>

        <h3 className="mt-2 font-serif text-2xl text-bark-800">
          <a href={href} className="transition-colors hover:text-pine-600">
            {cabin.name}
          </a>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-bark-600 lg:min-h-23">{cabin.summary}</p>

        <dl className="mt-5 grid grid-cols-3 divide-x divide-stone-200 rounded-2xl bg-stone-50 py-3 text-center">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col-reverse items-center">
              <dt className="text-[11px] text-bark-600">{fact.label}</dt>
              <dd className="flex items-center gap-1.5 text-sm font-semibold text-bark-800">
                <fact.icon size={15} aria-hidden="true" className="text-pine-600" />
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2 text-[13px] text-bark-600">
          {cabin.highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-1.5">
              <Check size={14} strokeWidth={2.5} aria-hidden="true" className="shrink-0 text-pine-600" />
              {highlight}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <div>
            <p className="text-bark-600">
              <span className="text-xs">From </span>
              <span className="font-serif text-2xl text-bark-800">${cabin.nightlyFrom}</span>
              <span className="text-xs"> / night</span>
            </p>
            <p className="text-[11px] text-bark-600">Additional charges may apply</p>
          </div>
          <a
            href={href}
            aria-label={`Check dates for ${cabin.name}`}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-pine-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-800"
          >
            Check dates
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
