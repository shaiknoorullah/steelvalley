"use client";
/**
 * HeroSceneFurnish — populates the void around the BT-1875 hero workstation
 * with background context so the scene reads as a real workshop, not a
 * floating prop. All meshes are programmatically generated (no extra GLB
 * downloads) and share a single Lambert material to keep draw calls minimal.
 *
 * Visibility ramps in during the Form → Place stages (progress 0.45+) so it
 * doesn't compete with the Earth/Heat wireframe stages.
 */
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useHeroProgress } from "./useHeroProgress";

const STEEL_GRAY = new THREE.Color(0x1f2937);
const WALL_WARM = new THREE.Color(0x2a221d);
const FLOOR_COOL = new THREE.Color(0x0e1014);

export function HeroSceneFurnish() {
  const groupRef = useRef<THREE.Group>(null);

  // Pre-build the geometry once.
  const meshes = useMemo(() => {
    const items: Array<{
      pos: [number, number, number];
      rot?: [number, number, number];
      geom: THREE.BufferGeometry;
      color: THREE.Color;
      role: "floor" | "wall" | "ws" | "pendant";
    }> = [];

    // Polished concrete floor — receives contact shadows from the workstation.
    items.push({
      pos: [0, 0.001, 0],
      rot: [-Math.PI / 2, 0, 0],
      geom: new THREE.PlaneGeometry(16, 12),
      color: FLOOR_COOL,
      role: "floor",
    });

    // Two back walls forming a corner — gives Place stage architectural depth.
    items.push({
      pos: [0, 2.4, -3.2],
      geom: new THREE.PlaneGeometry(10, 4.8),
      color: WALL_WARM,
      role: "wall",
    });
    items.push({
      pos: [-5, 2.4, 0],
      rot: [0, Math.PI / 2, 0],
      geom: new THREE.PlaneGeometry(6, 4.8),
      color: WALL_WARM,
      role: "wall",
    });

    // A second workstation in the background — same proportions as BT-1875,
    // smaller and rotated so the scene reads as a fabricated kitchen line.
    const wsTop = new THREE.BoxGeometry(1.4, 0.03, 0.6);
    const wsLeg = new THREE.CylinderGeometry(0.025, 0.025, 0.85, 12);
    items.push({
      pos: [-2.6, 0.85, -1.4],
      rot: [0, 0.35, 0],
      geom: wsTop,
      color: STEEL_GRAY,
      role: "ws",
    });
    // Four legs of the bg workstation
    for (const [lx, lz] of [
      [-0.6, -0.25],
      [0.6, -0.25],
      [-0.6, 0.25],
      [0.6, 0.25],
    ]) {
      items.push({
        pos: [-2.6 + lx * Math.cos(0.35), 0.425, -1.4 + lz + lx * Math.sin(0.35)],
        geom: wsLeg,
        color: STEEL_GRAY,
        role: "ws",
      });
    }

    // A third workstation further back, oriented differently
    items.push({
      pos: [2.2, 0.78, -1.8],
      rot: [0, -0.5, 0],
      geom: new THREE.BoxGeometry(1.2, 0.025, 0.55),
      color: STEEL_GRAY,
      role: "ws",
    });

    // Two pendant ceiling lights — short cylinders with brass interior bake.
    const pendantHousing = new THREE.CylinderGeometry(0.12, 0.16, 0.25, 16);
    items.push({
      pos: [-1.2, 3.4, 0],
      geom: pendantHousing,
      color: new THREE.Color(0x0a0a0b),
      role: "pendant",
    });
    items.push({
      pos: [1.5, 3.4, -0.3],
      geom: pendantHousing,
      color: new THREE.Color(0x0a0a0b),
      role: "pendant",
    });

    return items;
  }, []);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const { progress } = useHeroProgress.getState();
    // Fade in across Form → Place (0.4 → 0.95)
    const t = THREE.MathUtils.smoothstep(progress, 0.42, 0.85);
    if (g.userData.lastT !== t) {
      g.userData.lastT = t;
      g.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshLambertMaterial) {
          obj.material.opacity = t;
          obj.material.transparent = t < 1;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {meshes.map((m, i) => (
        <mesh
          key={i}
          position={m.pos}
          rotation={m.rot}
          renderOrder={m.role === "floor" ? -1 : 0}
        >
          <primitive object={m.geom} attach="geometry" />
          <meshLambertMaterial
            color={m.color}
            transparent
            opacity={0}
            side={m.role === "floor" || m.role === "wall" ? THREE.DoubleSide : THREE.FrontSide}
          />
        </mesh>
      ))}
    </group>
  );
}
