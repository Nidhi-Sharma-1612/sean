"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useRef } from "react";
import Reveal from "@/components/Reveal";
import { averageRating, cabins, totalReviews } from "@/lib/data/cabins";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

const journey = [
  { place: "California", detail: "Where we're from" },
  { place: "North Carolina", detail: "Home today" },
  { place: "The Smokies", detail: "Where our cabins are" },
];

const stats = [
  { value: cabins.length, label: "Mountain cabins" },
  { value: totalReviews, label: "Guest reviews" },
  { value: averageRating, label: "Average rating" },
];

export default function OurStory() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const insetY = useTransform(scrollYProgress, [0, 1], [32, -32]);

  return (
    <section id="story" ref={ref} className="overflow-hidden py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:gap-20">
        <Reveal className="relative pb-12 pr-8 sm:pr-16">
          <div className="relative aspect-4/5 overflow-hidden rounded-t-[10rem] rounded-b-3xl shadow-xl shadow-forest-950/15">
            <Image
              src={photos.pineTopCabin}
              alt="Pine Top Vista cabin beneath a ridgeline of the Great Smoky Mountains with low cloud in the valleys"
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>

          <motion.div
            style={reduceMotion ? undefined : { y: insetY }}
            className="absolute bottom-0 right-0 aspect-square w-[46%] overflow-hidden rounded-3xl shadow-xl shadow-forest-950/25 ring-8 ring-white"
          >
            <Image
              src={photos.bluffRidgeFireplace}
              alt="Leather armchairs beside the fireplace at Bluff Ridge Haven"
              fill
              sizes="(min-width: 1024px) 22vw, 42vw"
              className="object-cover"
            />
          </motion.div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-serif text-lg italic text-caramel-700">Our Story</p>
          <h2 className="mt-2 text-balance font-serif text-4xl text-bark-800 sm:text-5xl">
            Hello from Sean &amp; Sarah
          </h2>

          <p className="mt-6 font-serif text-xl leading-relaxed text-bark-800">
            We&rsquo;re Sean and Sarah&mdash;originally from California and now based in North
            Carolina. Along the way, we fell in love with the Great Smoky Mountains and the Carolina
            coast.
          </p>
          <p className="mt-4 text-base leading-relaxed text-bark-600">
            Our homes are places we personally enjoy, care for hands-on, and love sharing with
            guests. We hope they&rsquo;re where your family makes lasting memories, just like we do.
          </p>

          <ol className="relative mt-8 grid grid-cols-3 text-center">
            <span aria-hidden="true" className="absolute inset-x-[16.5%] top-1.25 border-t-2 border-dashed border-stone-200" />
            {journey.map((stop) => (
              <li key={stop.place} className="relative flex flex-col items-center px-1">
                <span className="h-3 w-3 rounded-full bg-pine-600 ring-4 ring-white" />
                <span className="mt-2 text-sm font-semibold text-bark-800">{stop.place}</span>
                <span className="text-xs text-bark-600">{stop.detail}</span>
              </li>
            ))}
          </ol>

          <dl className="mt-8 grid grid-cols-3 divide-x divide-stone-200 border-y border-stone-200 py-5 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse px-1">
                <dt className="mt-0.5 text-xs text-bark-600">{stat.label}</dt>
                <dd className="font-serif text-3xl text-pine-600">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-pine-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-800"
            >
              <Mail size={16} />
              Say hello
            </a>
            <a
              href="#cabins"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-pine-600 transition-colors hover:text-forest-800"
            >
              Meet our cabins
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
