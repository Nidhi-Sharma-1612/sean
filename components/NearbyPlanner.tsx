"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, FerrisWheel, MapPin, ShoppingBasket, TreePine, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { cabins } from "@/lib/data/cabins";
import { nearbyPlaces, type NearbyKind } from "@/lib/data/nearby";
import { cabinUrl } from "@/lib/search";

const icons: Record<NearbyKind, LucideIcon> = {
  attraction: FerrisWheel,
  nature: TreePine,
  supplies: ShoppingBasket,
  town: MapPin,
};

export default function NearbyPlanner({
  heading = "How close is everything?",
  description = "Pick a cabin to see what's nearby.",
}: {
  heading?: string;
  description?: string;
}) {
  const [cabinId, setCabinId] = useState(cabins[0].id);
  const cabin = cabins.find((item) => item.id === cabinId) ?? cabins[0];

  return (
    <div className="grid overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-bark-800/5 lg:grid-cols-[2fr_3fr]">
      <div className="bg-forest-800 p-6 text-white sm:p-8">
        <h3 className="font-serif text-2xl">{heading}</h3>
        <p className="mt-2 text-sm text-white/80">{description}</p>

        <div className="mt-6 flex flex-col gap-2" role="group" aria-label="Choose a cabin">
          {cabins.map((item) => {
            const selected = item.id === cabinId;

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setCabinId(item.id)}
                className={[
                  "flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-colors",
                  selected ? "bg-white text-forest-800" : "bg-white/10 text-white hover:bg-white/15",
                ].join(" ")}
              >
                <span className="text-sm font-semibold">{item.name}</span>
                <span className={`text-xs ${selected ? "text-bark-600" : "text-white/75"}`}>{item.town}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={cabinId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="divide-y divide-stone-200"
          >
            {nearbyPlaces[cabinId].map((place) => {
              const Icon = icons[place.kind];

              return (
                <li key={place.name} className="flex items-center gap-3 py-3.5 first:pt-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pine-600/10 text-pine-600">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <span className="flex-1 text-sm font-medium text-bark-800">{place.name}</span>
                  <span className="shrink-0 font-serif text-lg text-pine-600">{place.distance}</span>
                </li>
              );
            })}
          </motion.ul>
        </AnimatePresence>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <p className="text-xs text-bark-600">Approximate, from {cabin.name}.</p>
          <Link
            href={cabinUrl(cabin.slug)}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-pine-600 transition-colors hover:text-forest-800"
          >
            View {cabin.name}
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
