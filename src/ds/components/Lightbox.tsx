"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import * as D from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  startIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Lightbox({ images, startIndex = 0, open, onOpenChange }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const total = images.length;

  useEffect(() => {
    if (open) setIndex(startIndex);
  }, [open, startIndex]);

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  // Keyboard nav inside the lightbox
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  if (total === 0) return null;
  const current = images[index]!;

  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay data-component="lightbox-overlay" className="fixed inset-0 z-40 bg-black/80" />
        <D.Content
          data-component="lightbox-content"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            closeButtonRef.current?.focus();
          }}
        >
          <D.Title className="sr-only">
            Image {index + 1} of {total}
          </D.Title>
          <D.Description className="sr-only">{current.caption ?? current.alt}</D.Description>

          <D.Close
            ref={closeButtonRef}
            aria-label="Close"
            data-component="lightbox-close"
            className={cn("absolute end-4 top-4")}
          >
            ✕
          </D.Close>

          <button
            type="button"
            aria-label="Previous"
            onClick={prev}
            data-component="lightbox-prev"
            className="absolute start-4 top-1/2 -translate-y-1/2"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={next}
            data-component="lightbox-next"
            className="absolute end-4 top-1/2 -translate-y-1/2"
          >
            ›
          </button>

          <figure data-component="lightbox-figure">
            <img src={current.src} alt={current.alt} />
            {current.caption ? (
              <figcaption data-component="lightbox-caption">{current.caption}</figcaption>
            ) : null}
          </figure>

          <div data-component="lightbox-counter" aria-hidden="true">
            {index + 1} / {total}
          </div>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
