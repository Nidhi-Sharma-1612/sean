import Image from "next/image";

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-950 pb-16 pt-36 text-white sm:pb-20 sm:pt-40">
      <Image src={image} alt={imageAlt} fill preload sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-forest-950/70" />
      <div className="mx-auto max-w-7xl px-6">
        <p className="font-serif text-lg italic text-caramel-300">{eyebrow}</p>
        <h1 className="mt-2 max-w-3xl text-balance font-serif text-4xl leading-[1.1] sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-white/90">{description}</p>}
      </div>
    </section>
  );
}
