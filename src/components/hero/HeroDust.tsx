"use client";
/**
 * HeroDust — atmospheric dust particles, drifting subtly through a soft
 * volume around the workstation. Instanced points, GPU-cheap, always-on.
 * Adds "lived-in workshop" texture without competing with the main subject.
 */
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 140;
const RADIUS = 4.5;
const HEIGHT = 4;

export function HeroDust() {
  const ref = useRef<THREE.Points>(null);

  const { positions, drifts } = useMemo(() => {
    const p = new Float32Array(COUNT * 3);
    const d = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = Math.sqrt(Math.random()) * RADIUS;
      const theta = Math.random() * Math.PI * 2;
      p[i * 3 + 0] = Math.cos(theta) * r;
      p[i * 3 + 1] = Math.random() * HEIGHT;
      p[i * 3 + 2] = Math.sin(theta) * r;
      // Each mote gets a slow individual drift
      d[i * 3 + 0] = (Math.random() - 0.5) * 0.02;
      d[i * 3 + 1] = 0.005 + Math.random() * 0.015;
      d[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { positions: p, drifts: d };
  }, []);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] += drifts[i * 3] * delta;
      arr[i * 3 + 1] += drifts[i * 3 + 1] * delta;
      arr[i * 3 + 2] += drifts[i * 3 + 2] * delta;
      // Wrap back to bottom when a mote rises above the ceiling.
      if (arr[i * 3 + 1] > HEIGHT) arr[i * 3 + 1] = 0;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={0xfaf6ee}
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
