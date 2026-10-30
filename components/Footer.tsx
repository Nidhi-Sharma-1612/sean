import Image from "next/image";
import { ArrowRight, ArrowUp, Mail, MapPin } from "lucide-react";
import { cabins } from "@/lib/data/cabins";
import { BOOKING_ORIGIN, bookingUrl, navLinks, site } from "@/lib/site";

const legalLinks = [
  { href: `${BOOKING_ORIGIN}/en/privacy-policy`, label: "Privacy Policy" },
  { href: `${BOOKING_ORIGIN}/en/terms`, label: "Terms" },
];

const heading = "text-xs font-semibold uppercase tracking-wider text-caramel-300";

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.2v2.5H7.5v3.2h2.7V22h3.3Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="text-white">
      <div className="bg-forest-800">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-12 px-6 pb-14 pt-10 lg:grid-cols-[2fr_1.4fr_1fr_1.5fr] lg:gap-x-12">
          <div className="col-span-2 lg:col-span-1">
            <a href="#top" aria-label={`${site.name} home`} className="inline-block">
              <Image
                src="/images/logo.jpg"
                alt=""
                width={327}
                height={324}
                className="h-20 w-auto rounded-xl bg-white p-1"
              />
            </a>
            <p className="mt-4 max-w-xs font-serif text-lg italic text-white/90">{site.tagline}.</p>
            <a
              href={bookingUrl()}
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-caramel-300 px-6 py-3 text-sm font-semibold text-bark-800 transition-colors hover:bg-white"
            >
              Book Your Stay
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <nav aria-label="Our cabins">
            <h2 className={heading}>Our Cabins</h2>
            <ul className="mt-4 space-y-3">
              {cabins.map((cabin) => (
                <li key={cabin.id}>
                  <a href={bookingUrl({ cabinId: cabin.id })} className="group block">
                    <span className="block text-sm font-medium transition-colors group-hover:text-caramel-300">
                      {cabin.name}
                    </span>
                    <span className="block text-xs text-white/70">{cabin.town}, TN</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer">
            <h2 className={heading}>Explore</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-white/85 transition-colors hover:text-caramel-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 lg:col-span-1">
            <h2 className={heading}>Get in Touch</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/85">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2.5 break-all transition-colors hover:text-caramel-300"
                >
                  <Mail size={15} className="shrink-0 text-caramel-300" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 transition-colors hover:text-caramel-300"
                >
                  <span className="shrink-0 text-caramel-300">
                    <FacebookIcon />
                  </span>
                  Follow us on Facebook
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="shrink-0 text-caramel-300" />
                Great Smoky Mountains, Tennessee
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-5 text-xs text-white/75 lg:flex-row lg:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <p>
                &copy; {new Date().getFullYear()} {site.name}
              </p>
              {legalLinks.map((link) => (
                <a key={link.href} href={link.href} className="transition-colors hover:text-caramel-300">
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <span className="flex items-center gap-2">
                Designed and developed by
                <Image
                  src="/images/company-logo.png"
                  alt="Design by Dial"
                  width={940}
                  height={218}
                  className="h-5 w-auto"
                />
              </span>
              <a href="#top" className="inline-flex items-center gap-1 transition-colors hover:text-caramel-300">
                Back to top
                <ArrowUp size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
