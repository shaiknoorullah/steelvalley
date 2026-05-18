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
      {/* Three-point lighting tuned for industrial drama:
          - low ambient so shadows have depth
          - warm key + cool fill = stainless reflectivity that reads as alive
          - rust spotlight ramps during Heat (forge glow) and Edge (raking rim) */}
      <ambientLight intensity={0.45} color={0xb8c4d2} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={3.2}
        color={0xffefd5}
        castShadow={false}
      />
      <directionalLight
        position={[-3, 4, -2]}
        intensity={1.1}
        color={0x88a3c2}
      />
      {/* Overhead workshop pendant — narrow cone over the workstation. */}
      <spotLight
        position={[0, 4.2, 0]}
        target-position={[0, 0.8, 0]}
        angle={0.45}
        penumbra={0.6}
        distance={6}
        intensity={1.4}
        color={0xfff0d4}
      />
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
