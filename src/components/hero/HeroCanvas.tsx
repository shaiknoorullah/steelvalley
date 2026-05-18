"use client";
/**
 * HeroCanvas — R3F Canvas composing lights + workstation + sparks +
 * environment + camera rig. Wrapped in Suspense so useGLTF can suspend.
 *
 * Spec ref: docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md §3.
 */
import { AdaptiveDpr } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { HeroCameraRig } from "./HeroCameraRig";
import { HeroEnvironment } from "./HeroEnvironment";
import { HeroLights } from "./HeroLights";
import { HeroPosterFallback } from "./HeroPosterFallback";
import { HeroSparks } from "./HeroSparks";
import { HeroWorkstation } from "./HeroWorkstation";

export interface HeroCanvasProps {
  /** If true, mirrors camera yaw direction for RTL locales. */
  rtl?: boolean;
}

export function HeroCanvas({ rtl = false }: HeroCanvasProps) {
  return (
    <Suspense fallback={<HeroPosterFallback />}>
      <Canvas
        camera={{ position: [0, 8, 0.01], fov: 35, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        // `scrub` requires a continuous frame loop.
        frameloop="always"
        style={{ position: "absolute", inset: 0 }}
      >
        <color attach="background" args={["#0F1419"]} />
        <AdaptiveDpr pixelated />
        <HeroLights />
        <HeroWorkstation />
        <HeroSparks />
        <HeroEnvironment />
        <HeroCameraRig rtl={rtl} />
      </Canvas>
    </Suspense>
  );
}
