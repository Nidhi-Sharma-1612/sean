"use client";

import Image from "next/image";
import { motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { CabinPhoto } from "@/lib/data/cabins";

const arrow =
  "absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 sm:flex";

/** Rendered through a portal so transformed ancestors can't trap the fixed overlay. */
export default function PhotoViewer({
  name,
  photos,
  index,
  onIndexChange,
  onClose,
}: {
  name: string;
  photos: CabinPhoto[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const thumbsRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = photos.length;

  const go = useCallback(
    (delta: number) => onIndexChange((index + delta + count) % count),
    [index, count, onIndexChange],
  );

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [go, onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const active = thumbsRef.current?.children[index] as HTMLElement | undefined;
    active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [index]);

  function handleDragEnd(_: unknown, { offset }: PanInfo) {
    if (Math.abs(offset.x) > 50) go(offset.x < 0 ? 1 : -1);
  }

  const current = photos[index];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} photos`}
      className="fixed inset-0 z-100 flex flex-col bg-forest-950 text-white"
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <span className="text-sm font-semibold" aria-live="polite">
          {index + 1} / {count}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photos"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
        >
          <X size={20} />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 px-4 sm:px-20">
        <motion.div
          key={current.src}
          className="relative h-full w-full touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          <Image src={current.src} alt={current.alt} fill sizes="100vw" draggable={false} className="object-contain" />
        </motion.div>
        <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={`${arrow} left-4`}>
          <ChevronLeft size={22} />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next photo" className={`${arrow} right-4`}>
          <ChevronRight size={22} />
        </button>
      </div>

      <div ref={thumbsRef} className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            aria-label={`Show photo ${i + 1}`}
            aria-current={i === index}
            onClick={() => onIndexChange(i)}
            className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-opacity ${i === index ? "ring-2 ring-caramel-300" : "opacity-60 hover:opacity-100"}`}
          >
            <Image src={photo.src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
