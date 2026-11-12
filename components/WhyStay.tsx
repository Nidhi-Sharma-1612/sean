"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Baby, BedDouble, Droplets, Gamepad2, Users, Waves, type LucideIcon } from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import { cabins } from "@/lib/data/cabins";
import { cabinUrl } from "@/lib/search";
import { DEFAULT_FEATURES, type FeatureContent } from "@/lib/home-content";

export type { FeatureContent };

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  cabins: string[];
}

// Icons, alt text and cabin tags are fixed in code; title/description/image
// are admin-editable (same order as below).
const ICONS: LucideIcon[] = [Droplets, Waves, BedDouble, Gamepad2, Users, Baby];
const IMAGE_ALTS = [
  "Hot tub on a covered deck among the trees at Bluff Ridge Haven",
  "Heated indoor pool room with a Smoky Mountain mural at Bluff Ridge Haven",
  "Kids' bunk room with a slide and hanging swings at Cabana on Osprey",
  "Game room with a pool table and wood ceilings at Pine Top Vista",
  "Long dining table in the open-plan main room at Bluff Ridge Haven",
  "Family dining table set for a meal at Cabana on Osprey",
];
const CABIN_TAGS = [
  ["Bluff Ridge Haven", "Pine Top Vista", "Cabana on Osprey"],
  ["Bluff Ridge Haven", "Cabana on Osprey"],
  ["Bluff Ridge Haven", "Pine Top Vista", "Cabana on Osprey"],
  ["Bluff Ridge Haven", "Pine Top Vista"],
  ["Bluff Ridge Haven", "Pine Top Vista", "Cabana on Osprey"],
  ["Bluff Ridge Haven", "Pine Top Vista", "Cabana on Osprey"],
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

export default function WhyStay({
  eyebrow = "Why GSM",
  heading = "Everything your crew needs under one roof",
  description = "Plan a day out in the mountains, or don't. These cabins are built for rainy days and lazy mornings too.",
  featureContent = DEFAULT_FEATURES,
}: {
  eyebrow?: string;
  heading?: string;
  description?: string;
  featureContent?: FeatureContent[];
}) {
  const [active, setActive] = useState(0);
  const content = featureContent.length === DEFAULT_FEATURES.length ? featureContent : DEFAULT_FEATURES;
  const features: Feature[] = content.map((c, i) => ({
    ...c,
    icon: ICONS[i],
    imageAlt: IMAGE_ALTS[i],
    cabins: CABIN_TAGS[i],
  }));
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
          <p className="font-serif text-base italic text-caramel-300">{eyebrow}</p>
          <h2 className="mt-2 text-balance font-serif text-3xl sm:text-4xl">{heading}</h2>
          <p className="mt-4 text-base text-white/80">{description}</p>
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
