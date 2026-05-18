"use client";
/**
 * HeroEnvironment v3 — real PolyHaven HDR (kiara_interior_1k) for IBL.
 *
 * The kitchen scene itself (HeroKitchenScene) provides the walls/floor,
 * so we no longer need the placeholder warm-tone plane backdrop from v2.
 * The drei <ContactShadows> stays — gives the workstation a soft floor
 * shadow that grounds it without needing realtime shadow mapping.
 *
 * Suspense-wrapped <Environment> so the HDR fetch doesn't trigger the
 * parent canvas's HeroPosterFallback while it loads.
 */
import { ContactShadows, Environment } from "@react-three/drei";
import { Suspense } from "react";

const HDR_URL = "/3d/env/kiara_interior_1k.hdr";

export function HeroEnvironment() {
  return (
    <>
      <Suspense fallback={null}>
        <Environment
          files={HDR_URL}
          background={false}
          environmentIntensity={0.95}
        />
      </Suspense>

      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={0.55}
        scale={6}
        blur={2.2}
        far={3}
        color={0x000000}
      />
    </>
  );
}
