"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Gauge,
  Ruler,
  Thermometer,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { publicAsset } from "@/lib/paths";

type Props = {
  images: string[];
  equipmentId: string;
  equipmentName: string;
};

export function EquipmentImageSlider({
  images,
  equipmentId,
  equipmentName,
}: Props) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowLeft") {
        setIndex((i) => (i - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight") {
        setIndex((i) => (i + 1) % images.length);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreen, images.length]);

  if (!images.length) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="relative flex aspect-4/3 flex-col items-center justify-center bg-linear-to-br from-slate-100 via-slate-50 to-amber-50 p-8">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <div className="grid grid-cols-2 gap-3">
              <span className="flex size-14 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm">
                <Gauge className="size-6" aria-hidden />
              </span>
              <span className="flex size-14 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm">
                <Thermometer className="size-6" aria-hidden />
              </span>
              <span className="flex size-14 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm">
                <Zap className="size-6" aria-hidden />
              </span>
              <span className="flex size-14 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm">
                <Ruler className="size-6" aria-hidden />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                Gambar Peralatan
              </p>
              <p className="mt-1 font-mono text-xs text-slate-500">
                {equipmentId} · Placeholder visual
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const current = images[index] ?? images[0];

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="relative aspect-4/3 bg-slate-100">
          <button
            type="button"
            className="absolute inset-0 z-0 cursor-zoom-in"
            onClick={() => setFullscreen(true)}
            aria-label="Perbesar gambar ke layar penuh"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={publicAsset(current)}
              alt={`${equipmentName} — foto ${index + 1}`}
              className="size-full object-cover"
            />
          </button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="absolute top-3 right-3 z-10 bg-white/95 shadow-sm"
            onClick={() => setFullscreen(true)}
          >
            <Expand />
            Layar penuh
          </Button>

          {images.length > 1 ? (
            <>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute top-1/2 left-3 z-10 -translate-y-1/2 bg-white/90 shadow-sm"
                onClick={() =>
                  setIndex((i) => (i - 1 + images.length) % images.length)
                }
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute top-1/2 right-3 z-10 -translate-y-1/2 bg-white/90 shadow-sm"
                onClick={() => setIndex((i) => (i + 1) % images.length)}
                aria-label="Foto berikutnya"
              >
                <ChevronRight />
              </Button>
            </>
          ) : null}
        </div>
        {images.length > 1 ? (
          <div className="flex items-center justify-center gap-2 border-t border-slate-100 px-3 py-3">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Lihat foto ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "size-2.5 rounded-full transition-colors",
                  i === index
                    ? "bg-amber-500"
                    : "bg-slate-300 hover:bg-slate-400"
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      {fullscreen ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="Gambar layar penuh"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
            <p className="truncate text-sm">
              {equipmentName}
              <span className="ml-2 text-white/60">
                {index + 1} / {images.length}
              </span>
            </p>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="bg-white/10 text-white hover:bg-white/20"
              onClick={() => setFullscreen(false)}
              aria-label="Tutup layar penuh"
            >
              <X />
            </Button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={publicAsset(current)}
              alt={`${equipmentName} — foto ${index + 1} (layar penuh)`}
              className="max-h-full max-w-full object-contain"
            />

            {images.length > 1 ? (
              <>
                <Button
                  type="button"
                  size="icon-lg"
                  variant="secondary"
                  className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90"
                  onClick={() =>
                    setIndex((i) => (i - 1 + images.length) % images.length)
                  }
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft />
                </Button>
                <Button
                  type="button"
                  size="icon-lg"
                  variant="secondary"
                  className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90"
                  onClick={() => setIndex((i) => (i + 1) % images.length)}
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight />
                </Button>
              </>
            ) : null}
          </div>

          {images.length > 1 ? (
            <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-5">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "size-14 shrink-0 overflow-hidden rounded-md border-2",
                    i === index ? "border-amber-400" : "border-transparent opacity-70"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={publicAsset(src)}
                    alt=""
                    className="size-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
