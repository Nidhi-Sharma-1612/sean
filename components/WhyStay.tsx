"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Baby, BedDouble, Droplets, Gamepad2, Users, Waves, type LucideIcon } from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import { cabins } from "@/lib/data/cabins";
import { LISTING_ROOT } from "@/lib/photos";
import { cabinUrl } from "@/lib/search";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  cabins: string[];
}

const features: Feature[] = [
  {
    icon: Droplets,
    title: "Private Hot Tubs",
    description:
      "Every cabin has its own hot tub, ready for the end of a long day on the trails.",
    image: `${LISTING_ROOT}/695bbc5b3fe47f0015b6ba42/5682f2cd-f408-40--EMgD`,
    imageAlt: "Hot tub on a covered deck among the trees at Bluff Ridge Haven",
    cabins: ["Bluff Ridge Haven", "Pine Top Vista", "Cabana on Osprey"],
  },
  {
    icon: Waves,
    title: "Indoor Pools",
    description:
      "Heated pool rooms with mural walls, so the weather never decides your day.",
    image: `${LISTING_ROOT}/695bbc5b3fe47f0015b6ba42/3a8817e9-69d2-40-0P8Dv`,
    imageAlt: "Heated indoor pool room with a Smoky Mountain mural at Bluff Ridge Haven",
    cabins: ["Bluff Ridge Haven", "Cabana on Osprey"],
  },
  {
    icon: BedDouble,
    title: "Bunk Rooms Kids Love",
    description:
      "Climbing walls, a fireman's pole, slides, swings and triple bunks, depending on the cabin.",
    image: `${LISTING_ROOT}/695bbc5b714f2f00148920c2/b52d4531-73fa-4a-1sIFB`,
    imageAlt: "Kids' bunk room with a slide and hanging swings at Cabana on Osprey",
    cabins: ["Bluff Ridge Haven", "Pine Top Vista", "Cabana on Osprey"],
  },
  {
    icon: Gamepad2,
    title: "Game Rooms",
    description:
      "Pool, air hockey and shuffleboard at Pine Top Vista. Pac-Man, pinball and foosball at Bluff Ridge Haven.",
    image: `${LISTING_ROOT}/695bbc5ba87237001523e3c4/703b7232-77b9-47-6hh8T`,
    imageAlt: "Game room with a pool table and wood ceilings at Pine Top Vista",
    cabins: ["Bluff Ridge Haven", "Pine Top Vista"],
  },
  {
    icon: Users,
    title: "Room for Everyone",
    description:
      "Four to five bedrooms and space for 10 to 12 guests, so the whole group can stay together.",
    image: `${LISTING_ROOT}/695bbc5b3fe47f0015b6ba42/67f7f5b1-2c2b-41-MIzdz`,
    imageAlt: "Long dining table in the open-plan main room at Bluff Ridge Haven",
    cabins: ["Bluff Ridge Haven", "Pine Top Vista", "Cabana on Osprey"],
  },
  {
    icon: Baby,
    title: "Ready for Little Ones",
    description:
      "High chairs, travel cribs and stair gates at all three cabins, so there's less to pack.",
    image: `${LISTING_ROOT}/695bbc5b714f2f00148920c2/29542d7b-268e-45-r3Gd7`,
    imageAlt: "Family dining table set for a meal at Cabana on Osprey",
    cabins: ["Bluff Ridge Haven", "Pine Top Vista", "Cabana on Osprey"],
  },
];

function CabinLinks({ feature }: { feature: Feature }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-caramel-300">Find it at</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {cabins
          .filter((cabin) => feature.cabins.includes(cabin.name))
          .map((cabin) => (
            <Link
              key={cabin.id}
              href={cabinUrl(cabin.slug)}
              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-forest-800 transition-colors hover:bg-caramel-300"
            >
              {cabin.name}
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          ))}
      </div>
    </div>
  );
}

export default function WhyStay() {
  const [active, setActive] = useState(0);
  const current = features[active];

  // On phones the photo above closes as this one opens, so keep the tapped feature on screen.
  function handleSelect(index: number, button: HTMLButtonElement) {
    setActive(index);
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    window.setTimeout(() => button.scrollIntoView({ block: "nearest", behavior: "smooth" }), 320);
  }

  return (
    <section id="why" className="bg-forest-800 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          <p className="font-serif text-base italic text-caramel-300">Why GSM</p>
          <h2 className="mt-2 text-balance font-serif text-3xl sm:text-4xl">
            Everything your crew needs under one roof
          </h2>
          <p className="mt-4 text-base text-white/80">
            Plan a day out in the mountains, or don&rsquo;t. These cabins are built for rainy days
            and lazy mornings too.
          </p>
        </Reveal>

        <Reveal className="mt-12 grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-stretch">
          <ul className="flex flex-col gap-1.5">
            {features.map((feature, i) => {
              const isActive = i === active;

              return (
                <li key={feature.title}>
                  <button
                    type="button"
                    aria-expanded={isActive}
                    onClick={(event) => handleSelect(i, event.currentTarget)}
                    onFocus={() => setActive(i)}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") setActive(i);
                    }}
                    className={[
                      "flex w-full items-start gap-4 rounded-2xl p-4 text-left transition-colors",
                      isActive ? "bg-white/10" : "hover:bg-white/5",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                        isActive ? "bg-caramel-300 text-bark-800" : "bg-white/10 text-caramel-300",
                      ].join(" ")}
                    >
                      <feature.icon size={20} strokeWidth={1.75} />
                    </span>
                    <span>
                      <span className="block font-serif text-lg">{feature.title}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-white/75">
                        {feature.description}
                      </span>
                    </span>
                  </button>

                  {/* Phones open the photo under its feature; larger screens use the panel beside the list. */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden lg:hidden"
                      >
                        <div className="relative mt-2 aspect-4/3 overflow-hidden rounded-2xl">
                          <Image
                            src={feature.image}
                            alt={feature.imageAlt}
                            fill
                            sizes="(min-width: 640px) 90vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                        <div className="px-1 py-4">
                          <CabinLinks feature={feature} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <div className="relative hidden min-h-full overflow-hidden rounded-3xl bg-forest-950 lg:block">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: i === active ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={feature.image}
                  alt={i === active ? feature.imageAlt : ""}
                  fill
                  sizes="(min-width: 1280px) 720px, 58vw"
                  className="object-cover"
                />
              </motion.div>
            ))}
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-forest-950/90 via-forest-950/55 to-transparent p-6 pt-20">
              <CabinLinks feature={current} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
