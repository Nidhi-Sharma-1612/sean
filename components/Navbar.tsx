"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site";

export default function Navbar({
  logo = "/images/logo.jpg",
  bookLabel = "Book Now",
}: {
  logo?: string;
  bookLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathname = usePathname();

  // Only the homepage has a full-bleed hero to show through the bar.
  const overHero = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        overHero ? "bg-transparent" : "border-b border-stone-200 bg-white/95 backdrop-blur",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex max-w-7xl items-center justify-between px-6 transition-[height] duration-300",
          overHero ? "h-24" : "h-20",
        ].join(" ")}
      >
        <Link href="/" aria-label={`${site.name} home`} onClick={() => setOpen(false)}>
          {/* The logo artwork has a white background, so it sits on a white tile over the hero. */}
          <Image
            src={logo}
            alt=""
            width={327}
            height={324}
            preload
            className={[
              "w-auto rounded-xl bg-white transition-all duration-300",
              overHero ? "h-18 p-1 shadow-lg" : "h-14",
            ].join(" ")}
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "text-sm font-medium tracking-wide transition-colors",
                overHero
                  ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] hover:text-caramel-300"
                  : "text-bark-600 hover:text-pine-600",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/cabins"
            className="inline-flex items-center rounded-full bg-pine-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-800"
          >
            {bookLabel}
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={`p-2 md:hidden ${overHero ? "text-white" : "text-bark-800"}`}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden bg-white md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-bark-600"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/cabins"
                className="inline-flex items-center justify-center rounded-full bg-pine-600 px-6 py-3 text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                {bookLabel}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
