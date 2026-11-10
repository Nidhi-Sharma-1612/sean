"use client";

import { useEffect, useState } from "react";

/** Phone and tablet shortcut to the booking card, hidden once the card or footer is on screen. */
export default function MobileBookBar() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const targets = [document.getElementById("book"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el !== null,
    );
    const visible = new Set<Element>();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      setHidden(visible.size > 0);
    });

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-stone-200 bg-white px-4 py-3 lg:hidden">
      <p className="font-serif text-lg text-bark-800">Rates vary by date</p>
      <a
        href="#book"
        className="rounded-full bg-pine-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-800"
      >
        Check dates
      </a>
    </div>
  );
}
