"use client";
import dynamic, { type DynamicOptionsLoadingProps } from "next/dynamic";
import type { ComponentType, ReactNode } from "react";

interface Lazy3DOptions {
  fallback: ReactNode; // poster shown while loading or when PerfGate denies mount
}

/**
 * Always-lazy convention for R3F / Three.js scenes.
 * - ssr:false (Three.js touches window)
 * - explicit fallback (no flash of empty content)
 * - chunk-split per scene (verified by size-limit)
 *
 * Usage:
 *   const HeroScene = createLazy3D(() => import("./HeroScene"), { fallback: <PosterFallback ... /> });
 *   <HeroScene />
 */
export function createLazy3D<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  { fallback }: Lazy3DOptions,
): ComponentType<P> {
  const Loaded = dynamic(loader, {
    ssr: false,
    loading: (_: DynamicOptionsLoadingProps) => <>{fallback}</>,
  });
  return Loaded as ComponentType<P>;
}
