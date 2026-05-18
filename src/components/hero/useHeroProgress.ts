/**
 * Hero progress store (Zustand).
 *
 * Spec ref: docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md §3 "State store".
 *
 * The store is read in TWO modes:
 *   - via selector hook (`useHeroProgress((s) => s.progress)`) for React DOM
 *     overlay components that *should* re-render at stage boundaries.
 *   - via `useHeroProgress.getState()` inside `useFrame` for R3F components
 *     that update shader uniforms / camera state by mutating refs — they
 *     must NEVER trigger React re-renders inside the render loop.
 */
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type HeroStage = 0 | 1 | 2 | 3 | 4;

export interface HeroProgressState {
  /** Scrub progress through the pinned hero, 0..1. */
  progress: number;
  /** Derived stage: 0=Earth, 1=Heat, 2=Form, 3=Edge, 4=Place. */
  stage: HeroStage;
  /** Setter — only the scroll driver should call this. */
  set: (p: number) => void;
}

function deriveStage(p: number): HeroStage {
  const clamped = Math.max(0, Math.min(1, p));
  return Math.min(4, Math.floor(clamped * 5)) as HeroStage;
}

export const useHeroProgress = create<HeroProgressState>()(
  subscribeWithSelector((set) => ({
    progress: 0,
    stage: 0,
    set: (p: number) => {
      const progress = Math.max(0, Math.min(1, p));
      set({ progress, stage: deriveStage(progress) });
    },
  })),
);

export { deriveStage };
