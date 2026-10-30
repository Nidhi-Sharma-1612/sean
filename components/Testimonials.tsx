import { Star } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { testimonials, type Testimonial } from "@/lib/data/testimonials";

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const rating = testimonial.rating ?? 5;

  return (
    <figure className="flex h-80 w-72 shrink-0 flex-col justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-bark-800/5 sm:w-95 sm:p-8">
      <div>
        <div className="flex gap-1 text-caramel-500">
          {Array.from({ length: 5 }).map((_, starIdx) => (
            <Star
              key={starIdx}
              size={16}
              strokeWidth={1.5}
              fill={starIdx < rating ? "currentColor" : "none"}
            />
          ))}
        </div>
        <blockquote className="mt-4 line-clamp-5 font-serif text-lg italic leading-relaxed text-bark-800">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      </div>
      <figcaption className="mt-6 text-sm text-bark-600">
        <span className="block font-semibold text-bark-800">{testimonial.author}</span>
        <span className="block text-xs">{testimonial.cabin}</span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  if (testimonials.length === 0) return null;

  const track = [...testimonials, ...testimonials];

  return (
    <section className="py-24">
      <Reveal className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Guest Stories" title="What guests are saying" align="center" />
      </Reveal>

      <div className="relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused]">
          {track.map((testimonial, i) => (
            <TestimonialCard key={`${testimonial.id}-${i}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
