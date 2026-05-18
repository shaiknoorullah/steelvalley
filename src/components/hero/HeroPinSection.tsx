"use client";
/**
 * HeroPinSection — outer 500vh container that GSAP pins; inner sticky stage
 * holds the canvas + overlay + scroll driver.
 *
 * Spec ref: docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md §3.
 *
 * Locale-aware: reads `next-intl`'s `useLocale()` if available (defensively;
 * the locale package is being wired in a parallel worktree). RTL flips
 * camera yaw direction via the `rtl` prop on HeroCanvas.
 */
import { useEffect, useState } from "react";
import { HeroCanvas } from "./HeroCanvas";
import { HeroOverlay } from "./HeroOverlay";
import { HeroPosterFallback } from "./HeroPosterFallback";
import { HeroScrollDriver } from "./HeroScrollDriver";
import { Lazy3D } from "./_Lazy3D.local";
import { PerfGate } from "./_PerfGate.local";
import { useLocaleSafe } from "./_useLocaleSafe";

const PIN_ID = "sv-hero-pin";
const PIN_SELECTOR = `#${PIN_ID}`;

export interface HeroPinSectionProps {
  /** Override the section id (rare — only if mounted multiple times for testing). */
  id?: string;
}

export function HeroPinSection({ id = PIN_ID }: HeroPinSectionProps) {
  const locale = useLocaleSafe();
  const isAr = locale === "ar";

  // prefers-reduced-motion — fall through to the static poster. The hook
  // is intentionally simple; we don't subscribe to changes since this is a
  // hero stage decision, not a fine-grained animation.
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (reducedMotion) {
    return (
      <section
        aria-label={isAr ? "مشهد البداية" : "Hero"}
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#0F1419",
        }}
      >
        <HeroPosterFallback />
      </section>
    );
  }

  const selector = `#${id}`;

  return (
    <section
      id={id}
      aria-label={isAr ? "مشهد البداية" : "Hero"}
      style={{
        position: "relative",
        // 500vh = 5 stages × 100vh; GSAP pins the inner stage for this duration.
        height: "500vh",
        width: "100%",
        backgroundColor: "#0F1419",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Lazy3D fallback={<HeroPosterFallback />}>
          <PerfGate fallback={<HeroPosterFallback />}>
            {/* Canvas is `aria-hidden` to screen readers — the overlay's
                visually-hidden <ol> carries the narrative. */}
            <div aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
              <HeroCanvas rtl={isAr} />
            </div>
            <HeroOverlay pinSelector={selector} />
            <HeroScrollDriver pinSelector={selector} />
          </PerfGate>
        </Lazy3D>
      </div>
    </section>
  );
}
