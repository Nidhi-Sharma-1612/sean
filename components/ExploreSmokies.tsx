import Image from "next/image";
import NearbyPlanner from "@/components/NearbyPlanner";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { DEFAULT_TILES, type TileContent } from "@/lib/home-content";

export type { TileContent };

// Alt text and tile layout are fixed in code; title/description/image are
// admin-editable (same order as below).
const TILE_ALTS = [
  "Mountain stream running over mossy boulders through green forest",
  "Forested ridges rolling out toward distant peaks under a blue sky",
  "Fire pit benches on a grassy overlook at sunset",
  "Seasonal outdoor pool in the Pine Top Vista neighborhood, surrounded by trees",
];
const TILE_LAYOUT = [
  { className: "col-span-2 lg:row-span-2", sizes: "(min-width: 1024px) 620px, 100vw" },
  { className: "col-span-2", sizes: "(min-width: 1024px) 620px, 100vw" },
  { className: "", sizes: "(min-width: 1024px) 300px, 50vw" },
  { className: "", sizes: "(min-width: 1024px) 300px, 50vw" },
];

export default function ExploreSmokies({
  eyebrow = "Explore the Smokies",
  heading = "More than just a place to stay",
  description = "Trails and waterfalls on one side, the bright lights of the Parkway on the other. Your cabin puts you between them.",
  tileContent = DEFAULT_TILES,
  nearbyHeading,
  nearbyDescription,
}: {
  eyebrow?: string;
  heading?: string;
  description?: string;
  tileContent?: TileContent[];
  nearbyHeading?: string;
  nearbyDescription?: string;
}) {
  const content = tileContent.length === DEFAULT_TILES.length ? tileContent : DEFAULT_TILES;
  const tiles = content.map((c, i) => ({ ...c, alt: TILE_ALTS[i], ...TILE_LAYOUT[i] }));

  return (
    <section id="explore" className="bg-stone-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={heading} description={description} />
        </Reveal>

        <div className="mt-12 grid auto-rows-[11rem] grid-cols-2 gap-4 sm:auto-rows-[15rem] lg:grid-cols-4">
          {tiles.map((tile, i) => (
            <Reveal key={tile.title} delay={i * 0.08} className={`h-full ${tile.className}`}>
              <div className="group relative isolate h-full overflow-hidden rounded-3xl shadow-sm">
                <Image
                  src={tile.image}
                  alt={tile.alt}
                  fill
                  sizes={tile.sizes}
                  className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 -z-10 bg-linear-to-t from-forest-950/85 via-forest-950/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                  <h3 className="font-serif text-lg leading-snug sm:text-xl">{tile.title}</h3>
                  {tile.description && (
                    <p className="mt-1 max-w-sm text-sm text-white/85">{tile.description}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8">
          <NearbyPlanner heading={nearbyHeading} description={nearbyDescription} />
        </Reveal>
      </div>
    </section>
  );
}
