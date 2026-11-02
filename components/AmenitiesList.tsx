"use client";

import {
  Baby,
  Bath,
  Car,
  Check,
  ChevronDown,
  CookingPot,
  Dices,
  Droplets,
  Fan,
  Flame,
  Gamepad2,
  Shirt,
  ShieldCheck,
  Snowflake,
  Trees,
  Tv,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

const PREVIEW_COUNT = 12;

// Guest favourites come first in the preview, in this order.
const priority = ["pool", "hot tub", "fire pit", "fireplace", "game", "internet", "kitchen", "bbq", "patio", "garage", "tv", "washer", "air cond"];

const icons: [RegExp, LucideIcon][] = [
  [/hot tub/i, Droplets],
  [/pool/i, Waves],
  [/fire ?pit|fireplace|grill|bbq|barbeque/i, Flame],
  [/game|pool table/i, Gamepad2],
  [/board/i, Dices],
  [/internet|wifi/i, Wifi],
  [/tv/i, Tv],
  [/kitchen|cook|oven|stove|microwave|dish|refrigerator|freezer|toaster|blender|coffee/i, CookingPot],
  [/garage|parking/i, Car],
  [/air cond|heating/i, Snowflake],
  [/fan/i, Fan],
  [/bath|hair|hot water/i, Bath],
  [/washer|dryer|iron|hanger|linen/i, Shirt],
  [/crib|high chair|children|infant|changing|stair gate|corner|outlet/i, Baby],
  [/extinguisher|detector|first aid/i, ShieldCheck],
  [/garden|patio|outdoor/i, Trees],
];

function iconFor(amenity: string) {
  return icons.find(([pattern]) => pattern.test(amenity))?.[1] ?? Check;
}

function rank(amenity: string) {
  const index = priority.findIndex((term) => amenity.toLowerCase().includes(term));
  return index === -1 ? priority.length : index;
}

export default function AmenitiesList({ amenities }: { amenities: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...amenities].sort((a, b) => rank(a) - rank(b));
  const visible = expanded ? sorted : sorted.slice(0, PREVIEW_COUNT);

  return (
    <div>
      <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {visible.map((amenity) => {
          const Icon = iconFor(amenity);

          return (
            <li key={amenity} className="flex items-center gap-3 text-sm text-bark-600">
              <Icon size={18} strokeWidth={1.6} aria-hidden="true" className="shrink-0 text-pine-600" />
              {amenity}
            </li>
          );
        })}
      </ul>

      {sorted.length > PREVIEW_COUNT && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-pine-600 px-5 py-2.5 text-sm font-semibold text-pine-600 transition-colors hover:bg-pine-600 hover:text-white"
        >
          {expanded ? "Show fewer" : `Show all ${sorted.length} amenities`}
          <ChevronDown size={15} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}
