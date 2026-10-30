export type NearbyKind = "attraction" | "nature" | "supplies" | "town";

export interface NearbyPlace {
  name: string;
  distance: string;
  kind: NearbyKind;
}

// Approximate times and distances from each cabin's Guesty listing, keyed by cabin id.
export const nearbyPlaces: Record<string, NearbyPlace[]> = {
  "695bbc5b3fe47f0015b6ba42": [
    { name: "Restaurants, groceries & shopping", distance: "Within 10 min", kind: "supplies" },
    { name: "Pigeon Forge", distance: "15 min", kind: "town" },
    { name: "Downtown Sevierville", distance: "20 min", kind: "town" },
    { name: "Gatlinburg", distance: "40 min", kind: "town" },
  ],
  "695bbc5ba87237001523e3c4": [
    { name: "Climb Works zipline", distance: "3 miles", kind: "attraction" },
    { name: "Local market & deli", distance: "10 min", kind: "supplies" },
    { name: "National Park, Greenbrier entrance", distance: "15 min", kind: "nature" },
    { name: "Gatlinburg strip", distance: "30 min", kind: "town" },
  ],
  "695bbc5b714f2f00148920c2": [
    { name: "Restaurants, groceries & shopping", distance: "Within 5 min", kind: "supplies" },
    { name: "Dollywood", distance: "10 min", kind: "attraction" },
    { name: "Gatlinburg strip", distance: "25 min", kind: "town" },
    { name: "National Park", distance: "35 min", kind: "nature" },
  ],
};
