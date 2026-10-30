import { LISTING_ROOT } from "@/lib/photos";

export interface CabinPhoto {
  src: string;
  alt: string;
}

export interface Cabin {
  id: string;
  name: string;
  town: string;
  summary: string;
  bestFor: string;
  photos: CabinPhoto[];
  guests: number;
  bedrooms: number;
  bathrooms: number;
  nightlyFrom: number;
  /** Guesty's 10-point review score converted to 5 stars. */
  rating: number;
  reviewCount: number;
  highlights: string[];
}

// Facts and rates from each cabin's Guesty listing.
export const cabins: Cabin[] = [
  {
    id: "695bbc5b3fe47f0015b6ba42",
    name: "Bluff Ridge Haven",
    town: "Sevierville",
    summary:
      "A brand-new, secluded luxury cabin with a heated indoor pool, a game room and a kids' bunk room with a climbing wall, fireman's pole and saucer swing.",
    bestFor: "Best for secluded group stays",
    photos: [
      { src: `${LISTING_ROOT}/695bbc5b3fe47f0015b6ba42/4deb8c02-443d-4b-WoScD`, alt: "Indoor heated pool room with a Smoky Mountain mural at Bluff Ridge Haven" },
      { src: `${LISTING_ROOT}/695bbc5b3fe47f0015b6ba42/eecab389-6547-42-NNT25`, alt: "Game room with arcade machines and leather seating" },
      { src: `${LISTING_ROOT}/695bbc5b3fe47f0015b6ba42/3563984c-9e58-4f-7Ylo4`, alt: "Kids' bunk room with a rock climbing wall" },
      { src: `${LISTING_ROOT}/695bbc5b3fe47f0015b6ba42/5682f2cd-f408-40--EMgD`, alt: "Hot tub on the covered deck among the trees" },
      { src: `${LISTING_ROOT}/695bbc5b3fe47f0015b6ba42/e0326934-e305-49-uT_h0`, alt: "Open living room with vaulted wood ceilings" },
    ],
    guests: 12,
    bedrooms: 5,
    bathrooms: 5,
    nightlyFrom: 350,
    rating: 5,
    reviewCount: 31,
    highlights: ["Indoor heated pool", "Game room", "Hot tub", "Kids' bunk room"],
  },
  {
    id: "695bbc5ba87237001523e3c4",
    name: "Pine Top Vista",
    town: "Gatlinburg",
    summary:
      "Unobstructed panoramic views of the Smokies from all three decks and every room, plus a fire pit and a spacious game and bunk room.",
    bestFor: "Best for mountain views",
    photos: [
      { src: `${LISTING_ROOT}/695bbc5ba87237001523e3c4/044e78d3-322f-4f-SqwX_`, alt: "Rocking chair on the covered deck of Pine Top Vista, looking out over the mountains" },
      { src: `${LISTING_ROOT}/695bbc5ba87237001523e3c4/ba74457e-d9a2-4c-5wTjm`, alt: "Pine Top Vista cabin with a mountain ridgeline behind it" },
      { src: `${LISTING_ROOT}/695bbc5ba87237001523e3c4/703b7232-77b9-47-6hh8T`, alt: "Game room with a pool table and wood ceilings" },
      { src: `${LISTING_ROOT}/695bbc5ba87237001523e3c4/2deef514-9233-40-dViqw`, alt: "Living room with large windows facing the mountains" },
      { src: `${LISTING_ROOT}/695bbc5ba87237001523e3c4/622072f2-f4eb-46-A1bSj`, alt: "Fire pit benches on a grassy overlook at sunset" },
    ],
    guests: 12,
    bedrooms: 4,
    bathrooms: 3.5,
    nightlyFrom: 320,
    rating: 5,
    reviewCount: 7,
    highlights: ["Panoramic views", "Fire pit", "Hot tub", "Game room"],
  },
  {
    id: "695bbc5b714f2f00148920c2",
    name: "Cabana on Osprey",
    town: "Pigeon Forge",
    summary:
      "A private indoor pool in a cabana-themed room, three decks and a kids' bunk room with a slide and swings, minutes from the strip and 5 miles from Dollywood.",
    bestFor: "Best for Dollywood & the strip",
    photos: [
      { src: `${LISTING_ROOT}/695bbc5b714f2f00148920c2/a66a72ef-8667-4a-Yjmqr`, alt: "Private indoor pool with a tropical mural at Cabana on Osprey" },
      { src: `${LISTING_ROOT}/695bbc5b714f2f00148920c2/b52d4531-73fa-4a-1sIFB`, alt: "Kids' bunk room with a slide and hanging swings" },
      { src: `${LISTING_ROOT}/695bbc5b714f2f00148920c2/7b42ecdd-b732-4e-7EVMU`, alt: "Hot tub on the deck beside the trees" },
      { src: `${LISTING_ROOT}/695bbc5b714f2f00148920c2/e907ece2-1e71-4c-oe-Ct`, alt: "Living room with leather sofas and a stone fireplace" },
      { src: `${LISTING_ROOT}/695bbc5b714f2f00148920c2/6d186b33-cb19-44-q168E`, alt: "Rocking chairs on the upper deck overlooking the trees" },
    ],
    guests: 10,
    bedrooms: 4,
    bathrooms: 4.5,
    nightlyFrom: 275,
    rating: 4.95,
    reviewCount: 24,
    highlights: ["Private indoor pool", "Hot tub", "3 decks", "Kids' bunk room"],
  },
];

export const totalReviews = cabins.reduce((sum, cabin) => sum + cabin.reviewCount, 0);

export const averageRating =
  Math.round(
    (cabins.reduce((sum, cabin) => sum + cabin.rating * cabin.reviewCount, 0) / totalReviews) * 100,
  ) / 100;

export const maxGuests = Math.max(...cabins.map((cabin) => cabin.guests));
