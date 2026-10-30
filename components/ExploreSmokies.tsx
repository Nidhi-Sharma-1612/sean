import Image from "next/image";
import NearbyPlanner from "@/components/NearbyPlanner";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { photos } from "@/lib/photos";

const tiles = [
  {
    image: photos.smokiesCreek,
    alt: "Mountain stream running over mossy boulders through green forest",
    title: "Rivers & Forest Trails",
    description: "Endless hiking trails, swimming spots and waterfalls in the National Park.",
    className: "col-span-2 lg:row-span-2",
    sizes: "(min-width: 1024px) 620px, 100vw",
  },
  {
    image: photos.pineTopRidges,
    alt: "Forested ridges rolling out toward distant peaks under a blue sky",
    title: "Scenic Mountain Drives",
    description: "Ridge after ridge of green, right outside the door.",
    className: "col-span-2",
    sizes: "(min-width: 1024px) 620px, 100vw",
  },
  {
    image: photos.pineTopFirePit,
    alt: "Fire pit benches on a grassy overlook at sunset",
    title: "Fire-Pit Sunsets",
    className: "",
    sizes: "(min-width: 1024px) 300px, 50vw",
  },
  {
    image: photos.neighborhoodPool,
    alt: "Seasonal outdoor pool in the Pine Top Vista neighborhood, surrounded by trees",
    title: "Pools & Pickleball",
    className: "",
    sizes: "(min-width: 1024px) 300px, 50vw",
  },
];

export default function ExploreSmokies() {
  return (
    <section id="explore" className="bg-stone-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Explore the Smokies"
            title="More than just a place to stay"
            description="Trails and waterfalls on one side, the bright lights of the Parkway on the other. Your cabin puts you between them."
          />
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
          <NearbyPlanner />
        </Reveal>
      </div>
    </section>
  );
}
