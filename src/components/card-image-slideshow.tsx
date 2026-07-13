"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { publicAsset } from "@/lib/paths";

type Props = {
  images: string[];
  name: string;
};

export function CardImageSlideshow({ images, name }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!images.length) {
    return (
      <div className="flex aspect-16/10 items-center justify-center bg-linear-to-br from-slate-100 via-slate-50 to-amber-50 text-xs text-slate-500">
        Belum ada foto
      </div>
    );
  }

  return (
    <div className="group relative aspect-16/10 overflow-hidden bg-slate-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={publicAsset(images[index])}
        alt={`${name} — foto ${index + 1}`}
        className="size-full object-cover transition-opacity duration-500"
      />

      {images.length > 1 ? (
        <>
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/90 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIndex((i) => (i - 1 + images.length) % images.length);
            }}
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/90 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIndex((i) => (i + 1) % images.length);
            }}
            aria-label="Foto berikutnya"
          >
            <ChevronRight />
          </Button>
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Foto ${i + 1}`}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  i === index ? "bg-amber-500" : "bg-white/70"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIndex(i);
                }}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
