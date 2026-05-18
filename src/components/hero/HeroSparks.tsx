"use client";
/**
 * HeroSparks — 200 instanced welding spark particles, mounted only during
 * the Heat stage (stage === 1).
 *
 * Spec ref: docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md §2.
 *
 * No physics — alpha decays per particle, then respawns at a random
 * position inside a small volume above the welding seam. Cheap.
 */
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useHeroProgress } from "./useHeroProgress";

const COUNT = 200;
/** Volume the sparks spawn inside (meters), roughly above the weld seam. */
const VOL = { x: 1.4, y: 0.6, z: 0.8 };
const ORIGIN: [number, number, number] = [0, 0.85, 0];
const PARTICLE_SIZE = 0.012;

interface ParticleState {
  /** Velocity vector. */
  vx: number;
  vy: number;
  vz: number;
  /** Current life 0..1; 1 = freshly spawned. */
  life: number;
  /** Lifetime in seconds — controls decay speed. */
  ttl: number;
}

export function HeroSparks() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const states = useMemo<ParticleState[]>(
    () => Array.from({ length: COUNT }, () => spawn()),
    [],
  );

  // Use vertexColors so we can drive per-instance color (rust-orange tint).
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xe2611b),
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [],
  );

  const geometry = useMemo(
    () => new THREE.SphereGeometry(PARTICLE_SIZE, 6, 6),
    [],
  );

  useEffect(() => {
    return () => {
      material.dispose();
      geometry.dispose();
    };
  }, [material, geometry]);

  function spawn(): ParticleState {
    return {
      vx: (Math.random() - 0.5) * 0.6,
      vy: 0.3 + Math.random() * 0.7,
      vz: (Math.random() - 0.5) * 0.6,
      life: 1,
      ttl: 0.4 + Math.random() * 0.6,
    };
  }

  // Initialize instance matrices at random positions inside the volume.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < COUNT; i++) {
      dummy.position.set(
        ORIGIN[0] + (Math.random() - 0.5) * VOL.x,
        ORIGIN[1] + (Math.random() - 0.5) * VOL.y,
        ORIGIN[2] + (Math.random() - 0.5) * VOL.z,
      );
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    // Only animate during Heat stage.
    const { stage } = useHeroProgress.getState();
    if (stage !== 1) {
      // When not Heat, slam alpha to 0 — visually mounted but invisible.
      if (material.opacity !== 0) material.opacity = 0;
      return;
    }
    if (material.opacity !== 1) material.opacity = 1;

    for (let i = 0; i < COUNT; i++) {
      const s = states[i]!;
      s.life -= delta / s.ttl;
      if (s.life <= 0) {
        // Respawn
        const fresh = spawn();
        s.vx = fresh.vx;
        s.vy = fresh.vy;
        s.vz = fresh.vz;
        s.life = fresh.life;
        s.ttl = fresh.ttl;
        dummy.position.set(
          ORIGIN[0] + (Math.random() - 0.5) * 0.2,
          ORIGIN[1],
          ORIGIN[2] + (Math.random() - 0.5) * 0.2,
        );
      } else {
        mesh.getMatrixAt(i, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.position.x += s.vx * delta;
        dummy.position.y += s.vy * delta;
        dummy.position.z += s.vz * delta;
        // Gravity-ish
        s.vy -= 1.2 * delta;
      }
      const alpha = Math.max(0, s.life);
      dummy.scale.setScalar(alpha);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, COUNT]}
      frustumCulled={false}
    />
  );
}
