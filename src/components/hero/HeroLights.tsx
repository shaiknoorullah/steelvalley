"use client";
/**
 * HeroLights — ambient + directional + a rust-orange spot whose intensity
 * scales with the heat factor (active during Heat & Edge stages).
 *
 * Spec ref: docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md §2.
 */
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useHeroProgress } from "./useHeroProgress";

const RUST = new THREE.Color(0xe2611b);

export function HeroLights() {
  const spotRef = useRef<THREE.SpotLight>(null);

  useFrame(() => {
    const spot = spotRef.current;
    if (!spot) return;
    const { progress, stage } = useHeroProgress.getState();
    let intensity = 0;
    if (stage === 1) {
      // Heat: bell curve while the weld is hot.
      const t = (progress - 0.2) / 0.2;
      intensity = Math.max(0, Math.sin(t * Math.PI)) * 2.4;
    } else if (stage === 3) {
      // Edge: raking rim light comes up over the dolly-in.
      const t = THREE.MathUtils.smoothstep(progress, 0.6, 0.78);
      intensity = t * 1.6;
    }
    spot.intensity = intensity;
  });

  return (
    <>
      {/* v3 lighting: the IBL (kiara_interior_1k HDR) carries most of the
          lighting; we add three local fills for direction + drama.
          - Soft cool ambient bounces light into shadows
          - Warm key from camera-side simulates the kitchen's hood
          - Cool fill from the opposite side picks out the steel edges
          - Three pendant cones project warm light into the haze (GodRays
            in HeroPostFX will turn these into visible volumetric shafts)
          - Rust accent ramps during Heat (forge glow) and Edge (raking rim) */}
      <ambientLight intensity={0.25} color={0xb8c4d2} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.6}
        color={0xffefd5}
        castShadow={false}
      />
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.5}
        color={0x88a3c2}
      />
      {/* Three overhead pendant cones — positions match HeroKitchenScene's
          PENDANT_BULB meshes for the GodRays sources */}
      <spotLight
        position={[-1.2, 3.2, 0]}
        angle={0.5}
        penumbra={0.7}
        distance={5}
        intensity={1.8}
        color={0xfff0d4}
      />
      <spotLight
        position={[0, 3.2, 0.3]}
        angle={0.5}
        penumbra={0.7}
        distance={5}
        intensity={2.2}
        color={0xfff0d4}
      />
      <spotLight
        position={[1.2, 3.2, 0]}
        angle={0.5}
        penumbra={0.7}
        distance={5}
        intensity={1.8}
        color={0xfff0d4}
      />
      {/* Rust accent — Heat/Edge stages only */}
      <spotLight
        ref={spotRef}
        position={[1.2, 2.0, 1.8]}
        angle={0.55}
        penumbra={0.7}
        distance={6}
        color={RUST}
        intensity={0}
      />
    </>
  );
}
