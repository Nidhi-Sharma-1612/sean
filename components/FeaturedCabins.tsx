import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CabinCard from "@/components/CabinCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { cabins as defaultCabins, type Cabin } from "@/lib/data/cabins";

export default function FeaturedCabins({
  cabins = defaultCabins,
  eyebrow = "Our Cabins",
  heading = "Three cabins, three ways to do the Smokies",
  description = "Big views in Gatlinburg, an indoor pool close to the Pigeon Forge strip, and a secluded retreat outside Sevierville.",
  linkLabel = "See all availability",
}: {
  cabins?: Cabin[];
  eyebrow?: string;
  heading?: string;
  description?: string;
  linkLabel?: string;
}) {
  return (
    <section id="cabins" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={eyebrow} title={heading} description={description} />
          <Link
            href="/cabins"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-pine-600 transition-colors hover:text-forest-800"
          >
            {linkLabel}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
          {cabins.map((cabin, i) => (
            <Reveal key={cabin.id} delay={i * 0.12} className="h-full">
              <CabinCard cabin={cabin} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
