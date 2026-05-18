"use client";
/**
 * HeroEnvironment — soft ContactShadows always-on, plus a placeholder
 * kitchen-plate backdrop that fades in during Stage 4 (Place).
 *
 * Spec ref: docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md §2.
 */
import { ContactShadows } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
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
          color={0x2a221d}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}
