"use client";
/**
 * HeroPostFX v4.1 — EffectComposer chain. GodRays removed to fix a
 * production crash (passing a THREE.Mesh through React props/state hits a
 * JSON.stringify path that chokes on Three's parent/children cycle).
 * Pendant glow now comes from Bloom + non-toneMapped emissive material
 * alone, which still gives a strong cinematic read without the extra pass.
 *
 * Canonical pmndrs order:
 *   geometry → selective brightening → depth → optical → framing → tone → AA
 *
 * Mounts conditionally based on PerfGate tier:
 *   high — full chain incl. SSAO
 *   mid — drops SSAO + halves DoF resolution
 *   low — skipped entirely by HeroPinSection
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
  /** mid-end — drops SSAO + reduces DoF samples */
  midTier?: boolean;
}

export function HeroPostFX({ enabled = true, midTier = false }: Props) {
  const dofTarget = useMemo(() => new THREE.Vector3(0, 0.85, 0), []);
  const bloomRef = useRef<{ intensity: number } | null>(null);

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
      dofTarget.set(0, 1.0, 0);
    }

    if (bloomRef.current) {
      const baseBloom = 0.45;
      const peakBloom = midTier ? 0.9 : 1.6;
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

      <Bloom
        ref={bloomRef as never}
        luminanceThreshold={0.55}
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
