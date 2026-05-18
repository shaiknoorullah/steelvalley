"use client";
/**
 * HeroDemoPage — page-level shim wrapping the pinned hero plus a runway
 * of empty space below so locale pages can mount it for design review.
 *
 * The real locale page (built in feat-intl) will import this component.
 */
import { HeroPinSection } from "./HeroPinSection";

export interface HeroDemoPageProps {
  /** Space below the hero, in vh. Default 200vh for scroll-out runway. */
  runwayVh?: number;
}

export function HeroDemoPage({ runwayVh = 200 }: HeroDemoPageProps) {
  return (
    <main style={{ width: "100%", overflowX: "hidden" }}>
      <HeroPinSection />
      <div
        id="quote"
        style={{
          minHeight: `${runwayVh}vh`,
          width: "100%",
          backgroundColor: "#F2F0EC",
          color: "#0F1419",
          padding: "6rem 2rem",
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
        }}
      >
        <p style={{ maxWidth: "60ch", margin: "0 auto", lineHeight: 1.6 }}>
          {/* Placeholder for the post-hero section — Quote Builder, product
              grid, etc. The locale page agent will compose the real surface. */}
          Post-hero content placeholder. The Quote Builder (Plan 4) and the
          product grid mount below the hero in the final locale page.
        </p>
      </div>
    </main>
  );
}
