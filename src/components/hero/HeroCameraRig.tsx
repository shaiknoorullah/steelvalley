"use client";
/**
 * HeroCameraRig — waypoint-interpolated camera driven by useHeroProgress.
 *
 * Spec ref: docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md
 *           §3 "Camera path".
 *
 * Reads progress via `useHeroProgress.getState()` inside `useFrame` to avoid
 * React re-renders inside the render loop. RTL mirrors X coordinates so the
 * yaw direction reverses under `dir="rtl"`.
 */
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useHeroProgress } from "./useHeroProgress";

type Vec3 = readonly [number, number, number];

interface Waypoint {
  /** Progress at which this waypoint is reached, 0..1. */
  p: number;
  /** Camera position. */
  pos: Vec3;
  /** lookAt target. */
  look: Vec3;
  /** Field of view in degrees (PerspectiveCamera only). */
  fov: number;
}

/** Five waypoints — one per stage boundary. v4: workstation stays the hero
 *  while the kitchen frames it. Cameras land at heights/angles that catch
 *  the kitchen ceiling pendants in frame. */
export const HERO_WAYPOINTS: readonly Waypoint[] = [
  // Earth — top-down CAD plan view
  { p: 0.0, pos: [0, 8, 0.01], look: [0, 0, 0], fov: 35 },
  // Heat — tilts to ~30° elevation, gentle dolly in
  { p: 0.2, pos: [2.5, 6, 4], look: [0, 0.8, 0], fov: 40 },
  // Form — 45° elevation, the workstation framed in the middle third
  { p: 0.5, pos: [2.8, 2.0, 3.4], look: [0, 0.85, 0], fov: 40 },
  // Edge — dolly close on the front bullnose; pendant array catches frame top
  { p: 0.7, pos: [1.4, 1.2, 2.0], look: [0.25, 0.85, 0.25], fov: 32 },
  // Place — final hero shot: workstation centre, kitchen wrapping, pendant
  // glow upper-third. Pull-back enough that the workstation reads as a
  // PRODUCT in its context, not a tiny detail on the floor.
  { p: 1.0, pos: [2.6, 1.7, 3.4], look: [0, 1.1, 0], fov: 38 },
] as const;

function lerpVec3(a: Vec3, b: Vec3, t: number): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

/**
 * Pure interpolation helper exported for unit testing.
 * Returns the [pos, look, fov] tuple at progress `p`.
 */
export function sampleWaypoints(
  p: number,
  waypoints: readonly Waypoint[] = HERO_WAYPOINTS,
): { pos: [number, number, number]; look: [number, number, number]; fov: number } {
  if (waypoints.length === 0) {
    return { pos: [0, 0, 0], look: [0, 0, 0], fov: 45 };
  }
  const first = waypoints[0]!;
  const last = waypoints[waypoints.length - 1]!;
  if (p <= first.p) {
    return { pos: [...first.pos] as [number, number, number], look: [...first.look] as [number, number, number], fov: first.fov };
  }
  if (p >= last.p) {
    return { pos: [...last.pos] as [number, number, number], look: [...last.look] as [number, number, number], fov: last.fov };
  }
  let i = 0;
  while (i < waypoints.length - 1 && waypoints[i + 1]!.p < p) i++;
  const a = waypoints[i]!;
  const b = waypoints[Math.min(i + 1, waypoints.length - 1)]!;
  const span = Math.max(1e-6, b.p - a.p);
  const t = (p - a.p) / span;
  return {
    pos: lerpVec3(a.pos, b.pos, t),
    look: lerpVec3(a.look, b.look, t),
    fov: a.fov + (b.fov - a.fov) * t,
  };
}

export interface HeroCameraRigProps {
  /** If true, mirrors X axis — camera yaw reverses in RTL. */
  rtl?: boolean;
}

export function HeroCameraRig({ rtl = false }: HeroCameraRigProps) {
  const camera = useThree((s) => s.camera);

  useFrame(() => {
    const p = useHeroProgress.getState().progress;
    const { pos, look, fov } = sampleWaypoints(p);

    const sx = rtl ? -1 : 1;
    camera.position.set(sx * pos[0], pos[1], pos[2]);
    camera.lookAt(sx * look[0], look[1], look[2]);

    if (camera instanceof THREE.PerspectiveCamera) {
      if (camera.fov !== fov) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
