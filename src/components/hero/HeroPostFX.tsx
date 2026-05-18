"use client";
/**
 * HeroPostFX — EffectComposer chain per spec §5.5.
 *
 * Canonical order from pmndrs docs:
 *   geometry → selective brightening → depth manipulation
 *   → optical distortions → framing → tone → AA
 *
 * Mounts conditionally based on PerfGate tier so mid-end mobiles get a
 * cheaper chain and low-end skip post-processing entirely.
 *
 * The DoF target is scrubbed per scroll stage so the focus follows the
 * subject as the camera moves.
 */
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  SMAA,
  SSAO,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useHeroProgress } from "./useHeroProgress";

interface Props {
  /** false on low-end / reduced-motion — caller skips mounting */
  enabled?: boolean;
  /** mid-end — drops SSAO + reduces samples */
  midTier?: boolean;
}

export function HeroPostFX({ enabled = true, midTier = false }: Props) {
  // Scrub DoF target via a Vector3 we mutate per frame
  const dofTarget = useMemo(() => new THREE.Vector3(0, 0.85, 0), []);
  const dofRef = useRef<unknown>(null);

  // Earth/Heat: pull focus FAR (background) so the wireframe and 2D plan read sharp.
  // Form: focus on the workstation (origin)
  // Edge: shallow focus on the bullnose corner [0.5, 0.85, 0.5]
  // Place: focus back on workstation, slight bokeh on far walls
  useFrame(() => {
    if (!enabled) return;
    const { progress } = useHeroProgress.getState();
    if (progress < 0.4) {
      dofTarget.set(0, 0.85, 0);
    } else if (progress < 0.6) {
      dofTarget.set(0, 0.85, 0);
    } else if (progress < 0.8) {
      dofTarget.set(0.5, 0.85, 0.5);
    } else {
      dofTarget.set(0, 0.85, 0);
    }
  });

  if (!enabled) return null;

  return (
    <EffectComposer multisampling={0} enableNormalPass>
      {!midTier && (
        <SSAO
          blendFunction={BlendFunction.MULTIPLY}
          radius={0.15}
          intensity={20}
          samples={16}
          rings={4}
          distanceThreshold={1.0}
          distanceFalloff={0.5}
          rangeThreshold={0.5}
          rangeFalloff={0.1}
          worldDistanceThreshold={0}
          worldDistanceFalloff={0}
          worldProximityThreshold={0}
          worldProximityFalloff={0}
        />
      )}

      <Bloom
        luminanceThreshold={0.85}
        luminanceSmoothing={0.4}
        intensity={0.55}
        mipmapBlur
      />

      <DepthOfField
        ref={dofRef as never}
        target={dofTarget as never}
        focusDistance={0.01}
        focalLength={midTier ? 0.04 : 0.06}
        bokehScale={midTier ? 2 : 3}
        height={midTier ? 240 : 480}
      />

      <ChromaticAberration offset={[0.0004, 0.0004] as never} />

      <Vignette eskil={false} offset={0.15} darkness={0.55} />

      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />

      <SMAA />
    </EffectComposer>
  );
}
