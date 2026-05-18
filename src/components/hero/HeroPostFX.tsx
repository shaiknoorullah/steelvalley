"use client";
/**
 * HeroPostFX v4 — EffectComposer chain with conditional GodRays.
 *
 * Canonical pmndrs order:
 *   geometry → selective brightening → depth manipulation
 *   → optical distortions → framing → tone → AA
 *
 * GodRays pass renders only on the center pendant (highest-impact, lowest
 * cost) — each additional GodRays effect is a fullscreen pass. Two side
 * pendants get bright emissive + Bloom only, which gives a similar visual
 * effect at zero added GPU cost.
 *
 * Mounts conditionally based on PerfGate tier:
 *   high — full chain incl. GodRays + SSAO
 *   mid — drops GodRays + SSAO + halves DoF resolution
 *   low — skipped entirely by HeroPinSection
 */
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  GodRays,
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
  /** mid-end — drops SSAO + GodRays + reduces DoF samples */
  midTier?: boolean;
  /** Center pendant ref for the GodRays sun (set by HeroKitchenScene) */
  godrayPendant?: THREE.Mesh | null;
}

export function HeroPostFX({ enabled = true, midTier = false, godrayPendant }: Props) {
  // Scrub DoF target + Bloom intensity per stage
  const dofTarget = useMemo(() => new THREE.Vector3(0, 0.85, 0), []);
  const bloomRef = useRef<{ intensity: number } | null>(null);

  useFrame(() => {
    if (!enabled) return;
    const { progress } = useHeroProgress.getState();

    // DoF target follows the subject
    if (progress < 0.4) {
      dofTarget.set(0, 0.85, 0);
    } else if (progress < 0.6) {
      dofTarget.set(0, 0.85, 0);
    } else if (progress < 0.8) {
      // Edge — focus on the bullnose corner
      dofTarget.set(0.5, 0.85, 0.5);
    } else {
      dofTarget.set(0, 1.0, 0);
    }

    // Bloom ramps up dramatically in Place stage so the pendants read as lit
    if (bloomRef.current) {
      const baseBloom = 0.45;
      const peakBloom = midTier ? 0.8 : 1.1;
      const t = THREE.MathUtils.smoothstep(progress, 0.55, 0.9);
      bloomRef.current.intensity = baseBloom + (peakBloom - baseBloom) * t;
    }
  });

  if (!enabled) return null;

  return (
    <EffectComposer multisampling={0} enableNormalPass>
      {!midTier && (
        <SSAO
          blendFunction={BlendFunction.MULTIPLY}
          radius={0.15}
          intensity={22}
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

      {/* GodRays — single pass on the center pendant. Strong enough to read
          as visible light shafts through the fog without stacking 3 passes. */}
      {!midTier && godrayPendant && (
        <GodRays
          sun={godrayPendant as never}
          blendFunction={BlendFunction.SCREEN}
          samples={45}
          density={0.94}
          decay={0.92}
          weight={0.55}
          exposure={0.42}
          clampMax={1}
          blur
        />
      )}

      <Bloom
        ref={bloomRef as never}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.5}
        intensity={1.4}
        mipmapBlur
        radius={0.9}
      />

      <DepthOfField
        target={dofTarget as never}
        focusDistance={0.01}
        focalLength={midTier ? 0.04 : 0.065}
        bokehScale={midTier ? 2 : 3.2}
        height={midTier ? 240 : 480}
      />

      <ChromaticAberration offset={[0.0004, 0.0004] as never} />

      <Vignette eskil={false} offset={0.18} darkness={0.6} />

      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />

      <SMAA />
    </EffectComposer>
  );
}
