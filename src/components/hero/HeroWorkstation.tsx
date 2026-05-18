"use client";
/**
 * HeroWorkstation — loads the BT-1875 GLB, attaches our custom shader via
 * `onBeforeCompile`, and scrubs uniforms from useHeroProgress.
 *
 * Spec ref: docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md
 *           §3 "Shader integration (R3F)".
 *
 * CRITICAL — Blender pipeline note (from the asset team):
 *   The barycentric attribute in the GLB is named `_BARY` (glTF 2.0
 *   requires custom attributes to start with underscore), NOT `a_bary` as
 *   the spec shader code shows. We rename on load:
 *     geometry.setAttribute('a_bary', geometry.attributes._BARY);
 *     geometry.deleteAttribute('_BARY');
 *   The runtime shader then references `a_bary` as the spec writes it.
 *
 * Weld vertex colors live on `COLOR_0` (Three.js exposes as
 * `geometry.attributes.color`). They drive the `u_heat` emissive in the
 * shader.
 */
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useHeroProgress } from "./useHeroProgress";

const GLB_URL = "/3d/bt-1875.glb";
useGLTF.preload(GLB_URL);

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

  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;

      // 1. Rename _BARY → a_bary on the geometry. The Blender pipeline writes
      //    `_BARY` (glTF-compliant); the shader expects `a_bary`.
      const geom = obj.geometry as THREE.BufferGeometry;
      const baryUnderscore = geom.attributes["_BARY"];
      if (baryUnderscore && !geom.attributes["a_bary"]) {
        geom.setAttribute("a_bary", baryUnderscore);
        geom.deleteAttribute("_BARY");
      }

      // 2. Inject our shader chunks into the existing MeshStandardMaterial.
      const mat = obj.material;
      if (mat instanceof THREE.MeshStandardMaterial) {
        mat.onBeforeCompile = (shader) => {
          shader.uniforms.u_wireframe = uniforms.u_wireframe;
          shader.uniforms.u_pbrFill = uniforms.u_pbrFill;
          shader.uniforms.u_heat = uniforms.u_heat;

          shader.vertexShader = shader.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
               attribute vec3 a_bary;
               varying vec3 v_bary;`,
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
               v_bary = a_bary;`,
            );

          shader.fragmentShader = shader.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
               uniform float u_wireframe;
               uniform float u_pbrFill;
               uniform float u_heat;
               varying vec3 v_bary;
               float edgeFactor() {
                 vec3 d = fwidth(v_bary);
                 vec3 a3 = smoothstep(vec3(0.0), d * 1.2, v_bary);
                 return 1.0 - min(min(a3.x, a3.y), a3.z);
               }`,
            )
            .replace(
              "vec4 diffuseColor = vec4( diffuse, opacity );",
              `vec4 diffuseColor = vec4( diffuse, opacity );
               float wireMask = edgeFactor();
               vec3 wireColor = vec3(0.949, 0.941, 0.925); // bone
               vec3 heatColor = vec3(0.886, 0.380, 0.106); // rust
               vec3 wire = mix(wireColor, heatColor, u_heat);
               diffuseColor.rgb = mix(diffuseColor.rgb * u_pbrFill, wire, u_wireframe * wireMask);
               diffuseColor.a = mix(wireMask, 1.0, 1.0 - u_wireframe);`,
            );
        };
        mat.transparent = true;
        mat.needsUpdate = true;
      }
    });
  }, [scene, uniforms]);

  // Scrub uniforms every frame. Read store via getState — NO selector,
  // NO React state, NO re-renders inside useFrame.
  const lastWire = useRef(1);
  const lastPbr = useRef(0);
  const lastHeat = useRef(0);

  useFrame(() => {
    const { progress, stage } = useHeroProgress.getState();
    // Earth (0.00-0.20): wireframe full, pbr 0
    // Heat  (0.20-0.40): wireframe still on, heat spikes up then back down
    // Form  (0.40-0.60): wireframe fades out, pbr fades in
    // Edge  (0.60-0.80): pbr full
    // Place (0.80-1.00): pbr full + environment plate
    const wireFade = THREE.MathUtils.smoothstep(progress, 0.4, 0.55);
    const pbr = THREE.MathUtils.smoothstep(progress, 0.4, 0.6);
    const heat = stage === 1
      ? Math.sin(((progress - 0.2) / 0.2) * Math.PI)
      : 0;

    const wire = 1.0 - wireFade;
    // Only update uniforms when they actually change — tiny but cheap dedupe.
    if (wire !== lastWire.current) {
      uniforms.u_wireframe.value = wire;
      lastWire.current = wire;
    }
    if (pbr !== lastPbr.current) {
      uniforms.u_pbrFill.value = pbr;
      lastPbr.current = pbr;
    }
    if (heat !== lastHeat.current) {
      uniforms.u_heat.value = heat;
      lastHeat.current = heat;
    }
  });

  return <primitive object={scene} />;
}
