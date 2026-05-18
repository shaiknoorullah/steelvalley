"use client";
/**
 * Local Lazy3D stub.
 *
 * TODO(integration): swap import paths to `@/ds/perf` once feat-perf merges.
 * The real component (Plan 5) defers mount until the section is near the
 * viewport (IntersectionObserver) and renders `fallback` (a static poster)
 * until the heavy R3F bundle is loaded.
 *
 * This stub mounts children immediately so the hero worktree can build.
 */
import type { ReactNode } from "react";

export interface Lazy3DProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function Lazy3D({ children }: Lazy3DProps) {
  return <>{children}</>;
}
