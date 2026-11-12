import { LISTING_ROOT, photos } from "@/lib/photos";

// Default content for homepage sections. Lives in a plain (non "use client")
// module so Server Components (app/page.tsx) can import these as real
// values — importing a data constant from a "use client" file resolves to a
// client-reference stub instead of the value when read from server code.

export interface FeatureContent {
  title: string;
  description: string;
  image: string;
}

export const DEFAULT_FEATURES: FeatureContent[] = [
  {
    title: "Private Hot Tubs",
    description: "Every cabin has its own hot tub, ready for the end of a long day on the trails.",
    image: `${LISTING_ROOT}/695bbc5b3fe47f0015b6ba42/5682f2cd-f408-40--EMgD`,
  },
  {
    title: "Indoor Pools",
    description: "Heated pool rooms with mural walls, so the weather never decides your day.",
    image: `${LISTING_ROOT}/695bbc5b3fe47f0015b6ba42/3a8817e9-69d2-40-0P8Dv`,
  },
  {
    title: "Bunk Rooms Kids Love",
    description: "Climbing walls, a fireman's pole, slides, swings and triple bunks, depending on the cabin.",
    image: `${LISTING_ROOT}/695bbc5b714f2f00148920c2/b52d4531-73fa-4a-1sIFB`,
  },
  {
    title: "Game Rooms",
    description: "Pool, air hockey and shuffleboard at Pine Top Vista. Pac-Man, pinball and foosball at Bluff Ridge Haven.",
    image: `${LISTING_ROOT}/695bbc5ba87237001523e3c4/703b7232-77b9-47-6hh8T`,
  },
  {
    title: "Room for Everyone",
    description: "Four to five bedrooms and space for 10 to 12 guests, so the whole group can stay together.",
    image: `${LISTING_ROOT}/695bbc5b3fe47f0015b6ba42/67f7f5b1-2c2b-41-MIzdz`,
  },
  {
    title: "Ready for Little Ones",
    description: "High chairs, travel cribs and stair gates at all three cabins, so there's less to pack.",
    image: `${LISTING_ROOT}/695bbc5b714f2f00148920c2/29542d7b-268e-45-r3Gd7`,
  },
];

export interface JourneyStop {
  place: string;
  detail: string;
}

export const DEFAULT_JOURNEY: JourneyStop[] = [
  { place: "California", detail: "Where we're from" },
  { place: "North Carolina", detail: "Home today" },
  { place: "The Smokies", detail: "Where our cabins are" },
];

export interface TileContent {
  title: string;
  description: string;
  image: string;
}

export const DEFAULT_TILES: TileContent[] = [
  { title: "Rivers & Forest Trails", description: "Endless hiking trails, swimming spots and waterfalls in the National Park.", image: photos.smokiesCreek },
  { title: "Scenic Mountain Drives", description: "Ridge after ridge of green, right outside the door.", image: photos.pineTopRidges },
  { title: "Fire-Pit Sunsets", description: "", image: photos.pineTopFirePit },
  { title: "Pools & Pickleball", description: "", image: photos.neighborhoodPool },
];
