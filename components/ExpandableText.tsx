"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ExpandableText({ paragraphs }: { paragraphs: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? paragraphs : paragraphs.slice(0, 1);

  return (
    <div>
      <div className="space-y-4 text-base leading-relaxed text-bark-600">
        {visible.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {paragraphs.length > 1 && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-pine-600 hover:text-forest-800"
        >
          {expanded ? "Show less" : "Read more"}
          <ChevronDown size={15} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}
