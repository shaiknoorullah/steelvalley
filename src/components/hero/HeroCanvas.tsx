"use client";
/**
 * HeroCanvas v3 — R3F Canvas composing lights + workstation + kitchen scene +
 * environment + camera rig + post-processing chain.
 *
 * Spec refs:
 *   docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md §3
 *   docs/superpowers/specs/2026-05-18-hero-v3-cinematic-kitchen.md §3, §5
 *
 * Removed in v3:
 *   - HeroSceneFurnish (replaced by kitchen.glb)
 *   - HeroDust (replaced by exponential fog + GodRays through fog)
 *
 * Added in v3:
 *   - HeroKitchenScene (full PBR-textured kitchen)
 *   - HeroPostFX (EffectComposer chain)
 */
import { AdaptiveDpr } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import * as THREE from "three";
import { HeroCameraRig } from "./HeroCameraRig";
import { HeroEnvironment } from "./HeroEnvironment";
import { HeroKitchenScene } from "./HeroKitchenScene";
import { HeroLights } from "./HeroLights";
import { HeroPostFX } from "./HeroPostFX";
import { HeroPosterFallback } from "./HeroPosterFallback";
import { HeroWorkstation } from "./HeroWorkstation";

export interface HeroCanvasProps {
  /** If true, mirrors camera yaw direction for RTL locales. */
  rtl?: boolean;
  /** Disables post-processing chain on low-end devices. */
  enablePostFX?: boolean;
  /** Drops SSAO + reduces DoF resolution on mid-tier devices. */
  midTier?: boolean;
}

export function HeroCanvas({ rtl = false, enablePostFX = true, midTier = false }: HeroCanvasProps) {
  // Pendant refs are wired by HeroKitchenScene → consumed by future GodRays
  // (current cycle: SSAO + Bloom + DoF + Vignette + ToneMapping). GodRays
  // pass is added once pendant refs are stable across renders.
  const [, setPendantRefs] = useState<THREE.Mesh[]>([]);

  return (
    <Suspense fallback={<HeroPosterFallback />}>
      <Canvas
        camera={{ position: [0, 8, 0.01], fov: 35, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: false, // SMAA handles AA
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.4;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        frameloop="always"
        style={{ position: "absolute", inset: 0 }}
      >
        <color attach="background" args={["#0a0d12"]} />
        {/* Exponential height fog — soft atmospheric haze that lets light
            shafts read as visible volume without painting cartoon dust. */}
        <fogExp2 attach="fog" args={["#0a0d12", 0.075]} />

        <AdaptiveDpr pixelated />

        <HeroEnvironment />
        <HeroLights />

        <Suspense fallback={null}>
          <HeroKitchenScene onPendantsReady={setPendantRefs} />
        </Suspense>
        <HeroWorkstation />

        <HeroCameraRig rtl={rtl} />

        <HeroPostFX enabled={enablePostFX} midTier={midTier} />
      </Canvas>
    </Suspense>
  );
}
