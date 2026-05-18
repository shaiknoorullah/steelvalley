"use client";
/**
 * HeroScrollDriver
 *
 * One GSAP ScrollTrigger that pins the hero section and scrubs progress 0..1
 * into the Zustand store. R3F components read the store in `useFrame` without
 * triggering re-renders.
 *
 * Spec ref: docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md §3 "Scroll driver".
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useHeroProgress } from "./useHeroProgress";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface HeroScrollDriverProps {
  /** CSS selector for the element to pin. Typically the outer 500vh section. */
  pinSelector: string;
  /** Scroll length. Defaults to "+=500%". */
  end?: string;
}

export function HeroScrollDriver({
  pinSelector,
  end = "+=500%",
}: HeroScrollDriverProps) {
  const triggerRef = useRef<ScrollTrigger | null>(null);
  // Pull setter once; identity is stable so this won't refire useGSAP.
  const set = useHeroProgress.getState().set;

  useGSAP(
    () => {
      triggerRef.current = ScrollTrigger.create({
        trigger: pinSelector,
        start: "top top",
        end,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => set(self.progress),
      });

      return () => {
        triggerRef.current?.kill();
        triggerRef.current = null;
      };
    },
    { dependencies: [pinSelector, end] },
  );

  return null;
}
