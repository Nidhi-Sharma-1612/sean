import "server-only";

import detailsJson from "@/lib/data/cabin-details.json";
import { cabins as baseCabins, findCabin as findBaseCabin, type Cabin } from "@/lib/data/cabins";
import { getPageSections, img, num, objList, str, strList, type Section } from "@/lib/cms";

/**
 * Overlays admin-panel content onto a cabin. There's no live property-
 * management API behind this site (Guesty only supplies live booking
 * calendars via iCal — see lib/guesty.ts) — the cabin descriptions are a
 * one-time Guesty-listing copy, so without this layer the client would need
 * a code change to fix a typo. Each cabin's content lives under its own
 * "page" in the admin, keyed by its slug, with a "basics" and "details"
 * section below.
 *
 * Only descriptive/marketing fields are overridable. Booking-critical
 * fields — id, slug, guests, minNights, cleaningFee — are deliberately NOT
 * included here and always come from lib/data/cabins.ts: they feed Guesty's
 * live calendar lookups, occupancy validation and checkout, so an admin
 * typo there could let someone attempt a booking Guesty won't honor, or
 * under/over-state how many guests a cabin actually holds. Changing those
 * still requires a code change, by design.
 */

export interface RuleLine {
  level: number;
  text: string;
}

export interface CabinDetails {
  beds: number;
  checkIn: string;
  checkOut: string;
  about: string[];
  gettingThere: string;
  parking: string;
  notes: string[];
  amenities: string[];
  photos: { src: string; alt: string }[];
  rules: RuleLine[];
  policies: { pets: boolean; smoking: boolean; events: boolean };
}

const details = detailsJson as Record<string, CabinDetails>;

export type CmsCabin = Cabin & { details: CabinDetails };

function mergeCabin(cabin: Cabin, sections: Record<string, Section>): CmsCabin {
  const basics = sections.basics ?? {};
  const detailSection = sections.details ?? {};
  const base = details[cabin.slug];

  const cardPhotos = objList(basics, "photos", ["src", "alt"] as const, cabin.photos).filter(
    (p) => p.src.startsWith("/") || /^https?:\/\//.test(p.src),
  );

  const galleryUrls = strList(detailSection, "photos", base.photos.map((p) => p.src)).filter(
    (p) => p.startsWith("/") || /^https?:\/\//.test(p),
  );
  const gallery = galleryUrls.length > 0 ? galleryUrls.map((src, i) => ({ src, alt: `${cabin.name} photo ${i + 1}` })) : base.photos;

  const rules = objList(detailSection, "rules", ["level", "text"] as const, base.rules.map((r) => ({ level: String(r.level), text: r.text }))).map(
    (r) => ({ level: Number(r.level) || 0, text: r.text }),
  );

  return {
    ...cabin,
    name: str(basics, "name", cabin.name),
    town: str(basics, "town", cabin.town),
    summary: str(basics, "summary", cabin.summary),
    bestFor: str(basics, "bestFor", cabin.bestFor),
    highlights: strList(basics, "highlights", cabin.highlights),
    bedrooms: num(basics, "bedrooms", cabin.bedrooms),
    bathrooms: num(basics, "bathrooms", cabin.bathrooms),
    rating: num(basics, "rating", cabin.rating),
    reviewCount: Math.round(num(basics, "reviewCount", cabin.reviewCount)),
    photos: cardPhotos.length > 0 ? cardPhotos.map((p, i) => ({ src: img(p, "src", cabin.photos[i]?.src ?? cabin.photos[0].src), alt: p.alt })) : cabin.photos,
    details: {
      beds: Math.round(num(detailSection, "beds", base.beds)),
      checkIn: str(detailSection, "checkIn", base.checkIn),
      checkOut: str(detailSection, "checkOut", base.checkOut),
      about: strList(detailSection, "about", base.about),
      gettingThere: str(detailSection, "gettingThere", base.gettingThere),
      parking: str(detailSection, "parking", base.parking),
      notes: strList(detailSection, "notes", base.notes),
      amenities: strList(detailSection, "amenities", base.amenities),
      photos: gallery,
      rules,
      policies: {
        pets: detailSection.petsAllowed !== undefined ? detailSection.petsAllowed === "true" : base.policies.pets,
        smoking: detailSection.smokingAllowed !== undefined ? detailSection.smokingAllowed === "true" : base.policies.smoking,
        events: detailSection.eventsAllowed !== undefined ? detailSection.eventsAllowed === "true" : base.policies.events,
      },
    },
  };
}

export async function getCmsCabin(slug: string): Promise<CmsCabin | undefined> {
  const cabin = findBaseCabin(slug);
  if (!cabin) return undefined;
  const sections = await getPageSections(slug);
  return mergeCabin(cabin, sections);
}

export async function getCmsCabins(): Promise<CmsCabin[]> {
  return Promise.all(baseCabins.map(async (cabin) => mergeCabin(cabin, await getPageSections(cabin.slug))));
}
