import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Star } from "lucide-react";
import Reveal from "@/components/Reveal";
import { averageRating, cabins, totalReviews } from "@/lib/data/cabins";
import { photos } from "@/lib/photos";

const lowestRate = Math.min(...cabins.map((cabin) => cabin.nightlyFrom));

export default function CtaBand() {
  return (
    <section
      id="contact"
      className="relative isolate flex min-h-[44rem] items-center overflow-hidden pb-32 pt-24 lg:min-h-[46rem]"
    >
      <Image
        src={photos.pineTopSunset}
        alt="Sun setting behind the Smoky Mountains seen from Pine Top Vista"
        fill
        sizes="100vw"
        className="animate-cta-zoom -z-20 object-cover object-[64%_30%]"
      />
      {/* Shade sits behind the text only, so the sunset stays bright. */}
      <div className="absolute inset-0 -z-10 bg-forest-950/65 lg:bg-transparent lg:bg-linear-to-r lg:from-forest-950/90 lg:via-forest-950/55 lg:to-transparent" />

      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-forest-800 to-transparent" />

      <Reveal className="mx-auto w-full max-w-7xl px-6 text-white">
        <div className="max-w-xl">
          <p className="font-serif text-lg italic text-caramel-300">Start Planning</p>
          <h2 className="mt-2 text-balance font-serif text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
            Your cabin in the Smokies is waiting
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/90">
            Pick your dates and book, or send us a note and we&rsquo;ll help you find the right cabin
            for your group.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cabins"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-caramel-300 px-8 py-4 text-sm font-semibold text-bark-800 transition-colors hover:bg-white"
            >
              Check Availability
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Mail size={16} />
              Contact Us
            </Link>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/25 pt-6">
            <div className="flex flex-col-reverse">
              <dt className="text-xs text-white/80">Average from {totalReviews} guest reviews</dt>
              <dd className="flex items-center gap-1.5 font-serif text-2xl">
                <Star size={18} fill="currentColor" strokeWidth={0} className="text-caramel-300" />
                {averageRating}
              </dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="text-xs text-white/80">Per night, additional charges may apply</dt>
              <dd className="font-serif text-2xl">From ${lowestRate}</dd>
            </div>
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
