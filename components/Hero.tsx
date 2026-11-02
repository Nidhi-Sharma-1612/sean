"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import { useRef } from "react";
import BookingWidget from "@/components/BookingWidget";
import { averageRating, totalReviews } from "@/lib/data/cabins";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section className="relative z-10">
      <div ref={ref} className="relative flex min-h-[68dvh] items-center lg:min-h-[86dvh] overflow-hidden bg-forest-950">
        <motion.div className="absolute inset-y-[-8%] inset-x-0" style={{ y: photoY }}>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 12, ease: "easeOut" }}
          >
            <Image
              src={photos.pineTopFall}
              alt="Aerial view of Pine Top Vista cabin on a Smoky Mountain slope surrounded by autumn color"
              fill
              preload
              sizes="100vw"
              className="object-cover object-[22%_center] lg:object-center"
            />
          </motion.div>
        </motion.div>

        {/* Shade sits behind the text only, so the cabin side of the photo stays bright. */}
        <div className="absolute inset-0 bg-forest-950/60 lg:bg-transparent lg:bg-linear-to-r lg:from-forest-950/90 lg:via-forest-950/55 lg:to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-forest-950/60 to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 pt-28 sm:pb-32 sm:pt-36 lg:pb-36">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-serif text-lg italic text-caramel-300"
          >
            Gatlinburg &middot; Pigeon Forge &middot; Sevierville
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
            className="mt-4 max-w-2xl text-balance font-serif text-[2.5rem] leading-[1.05] text-white sm:text-6xl lg:text-7xl"
          >
            Your Basecamp in the Great Smoky Mountains
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease }}
            className="mt-4 max-w-lg text-base leading-relaxed text-white/90 sm:mt-6 sm:text-lg"
          >
            {site.tagline}, in three cabins cared for by their owners.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease }}
            className="mt-4 flex items-center gap-2 text-sm sm:mt-6 font-medium text-white"
          >
            <Star size={16} fill="currentColor" strokeWidth={0} className="text-caramel-300" />
            {averageRating} from {totalReviews} guest reviews
          </motion.p>
        </div>
      </div>

      {/* Straddles the photo's bottom edge to lead the eye into the page. */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.55, ease }}
        className="relative z-20 mx-auto -mt-20 max-w-6xl px-4 sm:px-6 lg:-mt-12"
      >
        <BookingWidget />
      </motion.div>
    </section>
  );
}
