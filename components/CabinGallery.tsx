"use client";

import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { CabinPhoto } from "@/lib/data/cabins";

const SWIPE_DISTANCE = 40;
const sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 576px, 100vw";

const arrow =
  "absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-forest-800 shadow-sm transition-opacity hover:bg-white focus-visible:opacity-100 lg:opacity-0 lg:group-hover/gallery:opacity-100";

export default function CabinGallery({ name, photos }: { name: string; photos: CabinPhoto[] }) {
  const [index, setIndex] = useState(0);
  const [warm, setWarm] = useState(false);

  function step(delta: number) {
    setIndex((current) => (current + delta + photos.length) % photos.length);
  }

  function handleDragEnd(_: unknown, { offset }: PanInfo) {
    if (Math.abs(offset.x) > SWIPE_DISTANCE) step(offset.x < 0 ? 1 : -1);
  }

  const neighbors = [
    photos[(index + 1) % photos.length],
    photos[(index - 1 + photos.length) % photos.length],
  ];

  return (
    <div
      role="group"
      aria-label={`${name} photos`}
      className="group/gallery relative aspect-4/3 overflow-hidden bg-stone-200"
      onPointerEnter={() => setWarm(true)}
      onFocus={() => setWarm(true)}
    >
      {/* Loads the next and previous photos once a guest shows interest, so a tap never shows a blank frame. */}
      {warm &&
        neighbors.map((photo) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt=""
            fill
            sizes={sizes}
            loading="eager"
            className="object-cover opacity-0"
          />
        ))}

      <AnimatePresence initial={false}>
        <motion.div
          key={photos[index].src}
          className="absolute inset-0 touch-pan-y"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
        >
          <Image
            src={photos[index].src}
            alt={photos[index].alt}
            fill
            sizes={sizes}
            draggable={false}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <button type="button" aria-label="Previous photo" className={`${arrow} left-3`} onClick={() => step(-1)}>
        <ChevronLeft size={18} />
      </button>
      <button type="button" aria-label="Next photo" className={`${arrow} right-3`} onClick={() => step(1)}>
        <ChevronRight size={18} />
      </button>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-1.5 bg-linear-to-t from-forest-950/50 to-transparent pb-3 pt-8">
        {photos.map((photo, i) => (
          <span
            key={photo.src}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Photo {index + 1} of {photos.length}: {photos[index].alt}
      </p>
    </div>
  );
}
