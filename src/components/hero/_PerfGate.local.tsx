"use client";
/**
 * Local PerfGate stub.
 *
 * TODO(integration): swap import paths to `@/ds/perf` once feat-perf merges.
 * The real component (Plan 5) gates on `deviceMemory < 4`, non-`4g` connection,
 * `Save-Data`, and `prefers-reduced-motion`, rendering `fallback` if denied.
 *
 * This stub always allows mount so the hero worktree can build and demo.
 */
import type { ReactNode } from "react";

export interface PerfGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function PerfGate({ children }: PerfGateProps) {
  return <>{children}</>;
}
