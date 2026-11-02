import Link from "next/link";
import PageHero from "@/components/PageHero";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

interface LegalSection {
  id: string;
  title: string;
  blocks: (string | string[])[];
}

export default function LegalPage({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={title}
        description={description}
        image={photos.pineTopRidges}
        imageAlt="Forested ridges rolling toward distant peaks"
      />

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:py-16 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
        <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:self-start lg:overflow-y-auto">
          <details className="rounded-2xl bg-stone-50 p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold text-bark-800">On this page</summary>
            <SectionLinks sections={sections} />
          </details>
          <div className="hidden lg:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-caramel-700">On this page</p>
            <SectionLinks sections={sections} />
          </div>
        </nav>

        <article className="max-w-3xl">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="border-b border-stone-200 py-7 first:pt-0 last:border-b-0">
              <h2 className="font-serif text-2xl text-bark-800">{section.title}</h2>
              <div className="mt-3 space-y-3 text-base leading-relaxed text-bark-600">
                {section.blocks.map((block, i) =>
                  Array.isArray(block) ? (
                    <ul key={i} className="space-y-2">
                      {block.map((item) => (
                        <li key={item} className="relative pl-5">
                          <span aria-hidden="true" className="absolute left-1 top-2.5 h-1.5 w-1.5 rounded-full bg-pine-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i}>{block}</p>
                  ),
                )}
              </div>
            </section>
          ))}

          <div className="mt-8 rounded-3xl bg-forest-800 p-6 text-white sm:p-8">
            <h2 className="font-serif text-2xl">Questions about this page?</h2>
            <p className="mt-2 text-sm text-white/85">
              We&rsquo;re happy to help. Reach us at {site.email} or through our contact page.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-block rounded-full bg-caramel-300 px-6 py-3 text-sm font-semibold text-bark-800 transition-colors hover:bg-white"
            >
              Contact us
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}

function SectionLinks({ sections }: { sections: LegalSection[] }) {
  return (
    <ul className="mt-3 space-y-2 text-sm">
      {sections.map((section) => (
        <li key={section.id}>
          <a href={`#${section.id}`} className="text-bark-600 transition-colors hover:text-pine-600">
            {section.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
