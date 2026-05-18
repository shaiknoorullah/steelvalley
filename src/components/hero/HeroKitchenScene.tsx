"use client";
/**
 * HeroKitchenScene — loads the full commercial kitchen GLB and applies PBR
 * texture maps based on each mesh's material name (STEEL, CONCRETE, TILE,
 * PLASTER, PENDANT_BULB).
 *
 * Opacity ramps in across Form → Place (progress 0.42 → 0.85) so the
 * wireframe-to-PBR handoff feels like the workstation is materialising
 * INSIDE the kitchen, not floating into a void.
 *
 * Texture tiers per spec §3.3:
 *   - Steel:    1024px (closest to camera)
 *   - Tile:      512px (mid distance, tiles 8×)
 *   - Concrete:  512px (floor, tiles 4×)
 *   - Plaster:   512px (side wall + ceiling)
 *
 * Performance:
 *   - 5 distinct materials (one per texture set), shared by all meshes
 *   - GLB ≈ 60 KB Draco-compressed, ≈ 3000 tris decoded
 *   - Pendant emissive picked up by GodRays in HeroPostFX
 */
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useHeroProgress } from "./useHeroProgress";

const GLB_URL = "/3d/kitchen.glb";
useGLTF.preload(GLB_URL);

interface Props {
  /** Refs are attached to the pendant emissive meshes so HeroPostFX can hand
   *  them to <GodRays> as light sources. */
  onPendantsReady?: (refs: THREE.Mesh[]) => void;
}

export function HeroKitchenScene({ onPendantsReady }: Props) {
  const { scene } = useGLTF(GLB_URL);

  // Texture sets loaded in parallel (Suspense'd by useTexture)
  const steelTex = useTexture({
    map: "/tex/steel/basecolor.jpg",
    normalMap: "/tex/steel/normal.jpg",
    roughnessMap: "/tex/steel/roughness.jpg",
    metalnessMap: "/tex/steel/metalness.jpg",
  });
  const concreteTex = useTexture({
    map: "/tex/concrete/basecolor.jpg",
    normalMap: "/tex/concrete/normal.jpg",
    roughnessMap: "/tex/concrete/roughness.jpg",
  });
  const tileTex = useTexture({
    map: "/tex/tile/basecolor.jpg",
    normalMap: "/tex/tile/normal.jpg",
    roughnessMap: "/tex/tile/roughness.jpg",
  });
  const plasterTex = useTexture({
    map: "/tex/plaster/basecolor.jpg",
    normalMap: "/tex/plaster/normal.jpg",
    roughnessMap: "/tex/plaster/roughness.jpg",
  });

  // Color space + tiling. Repeat per material in the consumer.
  useMemo(() => {
    for (const set of [steelTex, concreteTex, tileTex, plasterTex]) {
      for (const tex of Object.values(set)) {
        if (!tex) continue;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.anisotropy = 8;
      }
      // Only basecolor uses sRGB; the others are linear data maps.
      set.map.colorSpace = THREE.SRGBColorSpace;
    }
    steelTex.map.repeat.set(2, 2);
    concreteTex.map.repeat.set(4, 4);
    concreteTex.normalMap.repeat.set(4, 4);
    concreteTex.roughnessMap.repeat.set(4, 4);
    tileTex.map.repeat.set(8, 4);
    tileTex.normalMap.repeat.set(8, 4);
    tileTex.roughnessMap.repeat.set(8, 4);
    plasterTex.map.repeat.set(2, 2);
    plasterTex.normalMap.repeat.set(2, 2);
    plasterTex.roughnessMap.repeat.set(2, 2);
    // Steel normal/rough/metal use the same UV repeat as base
    steelTex.normalMap.repeat.set(2, 2);
    steelTex.roughnessMap.repeat.set(2, 2);
    steelTex.metalnessMap.repeat.set(2, 2);
  }, [steelTex, concreteTex, tileTex, plasterTex]);

  // Build one shared material per role (cheap; saves on draw calls)
  const materials = useMemo(() => {
    const steel = new THREE.MeshStandardMaterial({
      ...steelTex,
      metalness: 1.0,
      roughness: 0.42, // map modulates; this is the baseline
      envMapIntensity: 1.2,
      transparent: true,
      opacity: 0,
    });
    const concrete = new THREE.MeshStandardMaterial({
      ...concreteTex,
      metalness: 0.0,
      roughness: 0.65,
      envMapIntensity: 0.5,
      transparent: true,
      opacity: 0,
    });
    const tile = new THREE.MeshStandardMaterial({
      ...tileTex,
      metalness: 0.0,
      roughness: 0.32,
      envMapIntensity: 0.85,
      transparent: true,
      opacity: 0,
    });
    const plaster = new THREE.MeshStandardMaterial({
      ...plasterTex,
      metalness: 0.0,
      roughness: 0.95,
      envMapIntensity: 0.4,
      transparent: true,
      opacity: 0,
    });
    const pendant = new THREE.MeshBasicMaterial({
      color: 0xfff0d4,
      toneMapped: false,
      transparent: true,
      opacity: 0,
    });
    return { steel, concrete, tile, plaster, pendant };
  }, [steelTex, concreteTex, tileTex, plasterTex]);

  // Pendant refs for HeroPostFX god rays
  const pendantRefs = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    pendantRefs.current = [];
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const matName = (obj.material as THREE.Material).name;
      switch (matName) {
        case "STEEL":
          obj.material = materials.steel;
          break;
        case "CONCRETE":
          obj.material = materials.concrete;
          break;
        case "TILE":
          obj.material = materials.tile;
          break;
        case "PLASTER":
          obj.material = materials.plaster;
          break;
        case "PENDANT_BULB":
          obj.material = materials.pendant;
          pendantRefs.current.push(obj);
          break;
        default:
          // Unknown material — leave as-is so we can see/debug
          break;
      }
    });
    onPendantsReady?.(pendantRefs.current);
  }, [scene, materials, onPendantsReady]);

  // Fade in across Form → Place
  const lastT = useRef(-1);
  useFrame(() => {
    const { progress } = useHeroProgress.getState();
    const t = THREE.MathUtils.smoothstep(progress, 0.42, 0.78);
    if (Math.abs(t - lastT.current) < 0.001) return;
    lastT.current = t;
    materials.steel.opacity = t;
    materials.concrete.opacity = t;
    materials.tile.opacity = t;
    materials.plaster.opacity = t;
    // Pendant bulbs come in slightly later so they ramp visibly through the
    // god rays as you reach Edge/Place
    materials.pendant.opacity = THREE.MathUtils.smoothstep(progress, 0.6, 0.95);
  });

  return <primitive object={scene} />;
}
