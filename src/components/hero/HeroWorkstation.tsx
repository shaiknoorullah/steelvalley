"use client";
/**
 * HeroWorkstation — loads the BT-1875 GLB and renders it in two passes:
 *
 *   1. EdgesGeometry → LineSegments (CAD wireframe — only crease edges,
 *      not every triangle). Visible during Earth/Heat, fades during Form.
 *   2. The original PBR mesh — invisible at Earth, fades in during Form,
 *      fully visible by Edge/Place.
 *
 * Why two passes instead of a barycentric in-shader wireframe?
 *
 *   The Blender pipeline triangulates everything (required for the bevel
 *   modifier + Draco export). A barycentric edge mask then renders EVERY
 *   triangle edge, which collectively fill the whole surface — the
 *   workstation reads as a solid silhouette, not as a CAD drawing.
 *   EdgesGeometry filters to angle-crease edges only, which is the actual
 *   "CAD blueprint" look the spec calls for.
 *
 * Spec ref: docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md §3.
 */
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useHeroProgress } from "./useHeroProgress";

const GLB_URL = "/3d/bt-1875.glb";
useGLTF.preload(GLB_URL);

// CAD-style wireframe colors
const WIRE_BONE = new THREE.Color(0xf2f0ec);
const WIRE_RUST = new THREE.Color(0xe2611b);

export function HeroWorkstation() {
  const { scene } = useGLTF(GLB_URL);

  // Uniforms live on a `useMemo` so their identity is stable across renders.
  // We hand the same objects to every material's `onBeforeCompile` and to
  // `useFrame`, which mutates `.value` directly — no React state involved.
  const uniforms = useMemo(
    () => ({
      u_wireframe: { value: 1.0 },
      u_pbrFill: { value: 0.0 },
      u_heat: { value: 0.0 },
    }),
    [],
  );

  // Material refs we update from useFrame.
  const pbrMaterials = useRef<THREE.MeshStandardMaterial[]>([]);
  const wireMaterials = useRef<THREE.LineBasicMaterial[]>([]);

  useEffect(() => {
    pbrMaterials.current = [];
    wireMaterials.current = [];

    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;

      const geom = obj.geometry as THREE.BufferGeometry;

      // 1. Configure the PBR material — start invisible (Earth stage).
      const mat = obj.material;
      if (mat instanceof THREE.MeshStandardMaterial) {
        mat.transparent = true;
        mat.opacity = 0;
        // Boost the steel response so brushed stainless reads correctly.
        mat.metalness = 1.0;
        mat.roughness = 0.32;
        mat.emissive = WIRE_RUST.clone();
        mat.emissiveIntensity = 0;
        // Don't blend the weld vertex colors into the base color — they were
        // painted in Blender to drive the Heat-stage emissive, not the PBR
        // albedo. Leaving this on tints the welded legs red in the Place stage.
        mat.vertexColors = false;
        // Force base color to clean stainless (overrides whatever Blender set).
        mat.color.setHex(0xc7cdd6);
        mat.needsUpdate = true;
        pbrMaterials.current.push(mat);
      }

      // 2. Build the EdgesGeometry → LineSegments wireframe overlay.
      //    Threshold 30° means we extract any edge where the two faces
      //    meet at >30° (i.e. real geometric creases, not subdivided
      //    flat surfaces). This filters out triangulation artifacts.
      //    Skip if we've already added one (effect can re-fire on HMR).
      const existingWire = obj.children.find(
        (c) => c.userData?.svWire === true,
      );
      if (!existingWire) {
        const edges = new THREE.EdgesGeometry(geom, 30);
        const wireMat = new THREE.LineBasicMaterial({
          color: WIRE_BONE.clone(),
          transparent: true,
          opacity: 1.0,
          depthWrite: false,
          toneMapped: false,
        });
        const lines = new THREE.LineSegments(edges, wireMat);
        lines.userData.svWire = true;
        // Render in front of the mesh in the same coordinate space.
        lines.renderOrder = 2;
        obj.add(lines);
        wireMaterials.current.push(wireMat);
      } else if (existingWire instanceof THREE.LineSegments) {
        const m = existingWire.material;
        if (m instanceof THREE.LineBasicMaterial) {
          wireMaterials.current.push(m);
        }
      }
    });
  }, [scene]);

  // Scrub material opacity + emissive every frame from store state.
  // No React state, no re-renders.
  const lastWire = useRef(-1);
  const lastPbr = useRef(-1);
  const lastHeat = useRef(-1);

  useFrame(() => {
    const { progress, stage } = useHeroProgress.getState();
    // Earth (0.00-0.20): wireframe full, pbr 0
    // Heat  (0.20-0.40): wireframe full, heat bell-curve
    // Form  (0.40-0.60): wireframe fades out, pbr fades in
    // Edge  (0.60-0.80): pbr full
    // Place (0.80-1.00): pbr full
    const wireFade = THREE.MathUtils.smoothstep(progress, 0.42, 0.58);
    const pbr = THREE.MathUtils.smoothstep(progress, 0.4, 0.62);
    const heat = stage === 1 ? Math.sin(((progress - 0.2) / 0.2) * Math.PI) : 0;
    const wire = 1.0 - wireFade;

    if (Math.abs(wire - lastWire.current) > 0.001) {
      // Update wireframe material opacity + color (mix to rust during Heat).
      for (const m of wireMaterials.current) {
        m.opacity = wire;
        m.color.copy(WIRE_BONE).lerp(WIRE_RUST, heat);
      }
      lastWire.current = wire;
    }

    if (Math.abs(pbr - lastPbr.current) > 0.001) {
      for (const m of pbrMaterials.current) {
        m.opacity = pbr;
      }
      lastPbr.current = pbr;
    }

    if (Math.abs(heat - lastHeat.current) > 0.001) {
      // Heat emissive ramps during Heat stage (visible while PBR is still off).
      for (const m of pbrMaterials.current) {
        m.emissiveIntensity = heat * 0.6;
      }
      // Recolor wire to rust during Heat (already handled in wire block above
      // when wire changes; but if scroll is paused mid-Heat we still want the
      // color update). Touch one wire material to ensure copy fires:
      if (lastWire.current >= 0 && wireMaterials.current.length > 0) {
        for (const m of wireMaterials.current) {
          m.color.copy(WIRE_BONE).lerp(WIRE_RUST, heat);
        }
      }
      lastHeat.current = heat;
    }

    // Uniforms is unused now but kept to avoid breaking imports — silence lint.
    void uniforms;
  });

  return <primitive object={scene} />;
}
