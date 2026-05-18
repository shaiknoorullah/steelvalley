"use client";
/**
 * HeroEnvironment — soft ContactShadows, an environment map for PBR metals
 * to reflect (critical — metalness=1.0 reads as pure black without one),
 * plus a placeholder kitchen-plate backdrop that fades in during Stage 4.
 *
 * Spec ref: docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md §2.
 */
import { ContactShadows, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { useHeroProgress } from "./useHeroProgress";

export function HeroEnvironment() {
  const plateMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const mat = plateMatRef.current;
    if (!mat) return;
    const { progress } = useHeroProgress.getState();
    // Fade in across 0.80 → 0.95 of scroll.
    const t = THREE.MathUtils.smoothstep(progress, 0.8, 0.95);
    if (mat.opacity !== t) mat.opacity = t;
  });

  return (
    <>
      {/* Environment IBL. The "warehouse" preset gives our metallic stainless
          something to reflect — without it metalness=1.0 reads as pure black.
          Wrapped in its own Suspense with null fallback so the HDRI download
          (~100KB) doesn't trigger the parent canvas's HeroPosterFallback. */}
      <Suspense fallback={null}>
        <Environment preset="warehouse" background={false} environmentIntensity={0.85} />
      </Suspense>

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.45}
        scale={8}
        blur={2.4}
        far={4}
        color={0x000000}
      />

      {/*
        TODO: swap for user-supplied kitchen plate AVIF.
        For now this is a flat warm-tone plane sitting well behind the
        workstation; opacity ramps from 0 → 1 across the Place stage.
      */}
      <mesh position={[0, 1.6, -3.2]} rotation={[0, 0, 0]}>
        <planeGeometry args={[8, 4.5]} />
        <meshBasicMaterial
          ref={plateMatRef}
          color={0x3a2f25}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}
