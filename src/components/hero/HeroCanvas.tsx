"use client";
/**
 * HeroCanvas v4.1 — R3F Canvas composing lights + workstation + kitchen +
 * environment + camera rig + post-processing.
 *
 * v4.1 fix: removed the useState<THREE.Mesh[]> pendant-ref bridge. Three.js
 * objects contain parent/children cycles; once a Mesh sits in React state,
 * something in the RSC / error path tries to `JSON.stringify` it and the
 * page crashes ("Converting circular structure to JSON"). HeroPostFX now
 * looks pendants up by name via the scene graph each frame.
 */
import { AdaptiveDpr } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
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
        <fogExp2 attach="fog" args={["#0a0d12", 0.075]} />

        <AdaptiveDpr pixelated />

        <HeroEnvironment />
        <HeroLights />

        <Suspense fallback={null}>
          <HeroKitchenScene />
        </Suspense>
        <HeroWorkstation />

        <HeroCameraRig rtl={rtl} />

        <HeroPostFX enabled={enablePostFX} midTier={midTier} />
      </Canvas>
    </Suspense>
  );
}
