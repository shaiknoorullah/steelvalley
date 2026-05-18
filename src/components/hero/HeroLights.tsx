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
      {/* Boosted lighting so the PBR-lit stages (Form/Edge/Place) actually
          read as brushed steel, not muddy gray. The wireframe stage is no
          longer affected by these — we override gl_FragColor before they
          contribute. */}
      <ambientLight intensity={1.0} color={0xffffff} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={2.6}
        color={0xffffff}
        castShadow={false}
      />
      {/* Secondary key from the opposite side — keeps the metal legible. */}
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.8}
        color={0xb8c4d2}
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
