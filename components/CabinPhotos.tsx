"use client";

import Image from "next/image";
import { Images } from "lucide-react";
import { useState } from "react";
import PhotoViewer from "@/components/PhotoViewer";
import type { CabinPhoto } from "@/lib/data/cabins";

export default function CabinPhotos({ name, photos }: { name: string; photos: CabinPhoto[] }) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [lead, ...rest] = photos;

  return (
    <div className="relative">
      <div className="grid gap-2 overflow-hidden rounded-3xl lg:h-[30rem] lg:grid-cols-4 lg:grid-rows-2">
        <button
          type="button"
          aria-label={`View ${name} photos`}
          onClick={() => setViewerIndex(0)}
          className="relative aspect-4/3 overflow-hidden lg:col-span-2 lg:row-span-2 lg:aspect-auto"
        >
          <Image
            src={lead.src}
            alt={lead.alt}
            fill
            preload
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </button>
        {rest.slice(0, 4).map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            aria-label={`View photo ${i + 2}`}
            onClick={() => setViewerIndex(i + 1)}
            className="relative hidden overflow-hidden lg:block"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setViewerIndex(0)}
        className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-bark-800 shadow-md transition-colors hover:bg-stone-50"
      >
        <Images size={16} />
        View all {photos.length} photos
      </button>

      {viewerIndex !== null && (
        <PhotoViewer
          name={name}
          photos={photos}
          index={viewerIndex}
          onIndexChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </div>
  );
}
