# Hero v3 — Cinematic Commercial Kitchen Scene

**Date:** 2026-05-18
**Branch:** `main`
**Status:** Plan-in-progress, awaiting user sign-off.

User feedback that triggered this plan:
> "go to sketchfab, gather references… one table visible here, that's not how a kitchen looks like. The dust particles are countable on fingers. Firstly, you can't see dust particles in reality. The sky is the limit. You could learn anything, you could execute anything."

Read with: `docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md` (v1 spec) and the v1/v2 hero implementation under `src/components/hero/`.

---

## 0. Honest diagnosis of v2

| Problem | Root cause | Fix in v3 |
|---|---|---|
| Single table reads as "floating prop" | Background scene is 5-6 untextured Lambert primitives | Build a real kitchen scene (10+ elements with PBR textures), not pure programmatic primitives |
| "Dust particles" look toy-like | Wrong physics — visible dust requires high-intensity light shafts in a dark room. 140 sparse motes is countable, not atmospheric | Replace with **height-based exponential fog** + volumetric god rays only where light cones cut through air. No standalone "particle" system. |
| Stainless steel material reads as bland metal | `MeshStandardMaterial` with `metalness=1`, `roughness=0.32`, no textures, basic warehouse HDR | Real PBR texture maps (base+normal+roughness+metalness) from AmbientCG. Real interior HDR (PolyHaven Kiara). |
| No depth/separation | No post-processing | EffectComposer: SSAO → Bloom → DoF → ToneMapping → SMAA → Vignette |
| Camera framing too tight on a small subject | Place stage camera too close, scene too small | Wider Blender scene + pull-back camera + DoF focus on workstation |
| WebGPU raytracing | Three.js r170 WebGPURenderer doesn't ship hardware RT; experimental path-tracing examples are research-grade not production | Defer. Modern rasterisation with PBR + IBL + SSAO + Bloom + DoF + god rays gets us 90% of the visual delta at 60fps on real hardware. |

---

## 1. Reference research (what I gathered)

### State-of-the-art Three.js techniques
- **Wael Yasmina — "Ultra-Realistic Scenes in Three.js"** (2024): RGBELoader + EquirectangularReflectionMapping; `ACESFilmicToneMapping` with exposure ≈ 1.4-1.8; assign `scene.environment` for global IBL + per-material `envMap` for control; `MeshPhysicalMaterial` for transmissive surfaces.
- **@react-three/postprocessing** (pmndrs): canonical effect chain order is `geometry effects → selective brightening → depth manipulation → color/tone → optical distortions → framing → AA`. Implemented as: SSAO/GTAO → Bloom → DepthOfField → ChromaticAberration → Vignette → ToneMapping → SMAA.
- **three-good-godrays** (Ameobea) / pmndrs `<GodRays>`: screen-space ray-marched god rays driven by a sun mesh. For our case we'll use 3 pendant emissive meshes as the "suns" — gives volumetric light shafts through the haze.
- **Three.js forum** on volumetric light: most production scenes use either screen-space GodRays (cheap) or "fake" cone-mesh-with-additive-blending (cheaper still). True 3D volumetrics are research-grade.

### Asset sources (all CC0)
- **PolyHaven HDRIs** (free 2K/4K/8K HDRs, CC0): `kiara_interior` (warm interior with mixed natural+artificial light — perfect for kitchen stainless reflections); fallback `studio_small_06` (controlled studio for stronger speculars).
- **AmbientCG textures** (2000+ CC0 PBR materials): `Metal046A` (brushed steel), `Concrete032`/`Concrete025` (polished concrete floor), `Tiles091`/`Tiles052` (back wall tile), `Wood029` (optional accent), `Plaster001` (side wall).
- **No external 3D models** — we build the kitchen scene in Blender from primitives so we own the topology, control the polycount, and stay within the 250 KB GLB budget. The user already loved that we ship 50 KB GLBs for the workstation.

---

## 2. Goals & non-goals

### Goals
1. Reads as a real commercial kitchen, not a workstation floating in fog
2. Stainless steel surfaces actually look like brushed stainless steel (PBR textures + IBL)
3. Cinematic post-processing: SSAO + Bloom + DoF + Vignette + SMAA
4. Volumetric pendant light shafts that you can see cutting through the air (the right way to do "atmospheric dust")
5. Exponential height fog for atmospheric depth (not visible particles)
6. Place stage frames the workstation in context within the kitchen
7. 60fps target on desktop, graceful mobile fallback (drop post-processing on low-end via `<PerfGate>`)
8. GLB payload stays under 800 KB

### Non-goals (v3)
- WebGPU hardware raytracing
- Animated chef silhouette
- Real photography swap (user-supplied at launch, per checklist)
- Dynamic time-of-day or simulated cooking
- Multiple workstation variants

---

## 3. Architecture

### Asset layout

```
public/
├── 3d/
│   ├── kitchen.glb               ← NEW: full scene
│   ├── bt-1875.glb               ← KEEP
│   ├── edge-monument.glb         ← KEEP unchanged
│   └── env/
│       └── kiara_interior_2k.hdr ← NEW: PolyHaven IBL (~2 MB)
└── tex/
    ├── steel/                     ← AmbientCG Metal046A
    │   ├── basecolor.jpg
    │   ├── normal.jpg
    │   ├── roughness.jpg
    │   └── metalness.jpg
    ├── concrete/                  ← AmbientCG Concrete032
    │   ├── basecolor.jpg
    │   ├── normal.jpg
    │   └── roughness.jpg
    └── tile/                      ← AmbientCG Tiles091
        ├── basecolor.jpg
        ├── normal.jpg
        └── roughness.jpg
```

**Texture budget:** 9 maps × ~150 KB ≈ 1.4 MB. Total new assets ≈ 4 MB (HDR + textures + GLB). All lazy-loaded behind `<Lazy3D>`.

### Smart compression + distance-based quality (per user, added 2026-05-18)

The user's right — not every surface needs full-res maps. Tiering:

| Tier | Surfaces | Texture resolution | Why |
|---|---|---|---|
| **Hero** (camera proximity ≤ 1.5m) | BT-1875 workstation top, bullnose edge, weld beads | 1024×1024 JPG q85 | Camera dollies right up to these in Edge stage |
| **Mid** (1.5-4m) | Background prep tables, exhaust hood, wall shelving, hanging utensil rail | 512×512 JPG q80 | Visible at distance but never close |
| **Far** (>4m) | Polished concrete floor (with high tiling so res-per-tile stays decent), back tile wall, side plaster wall | 512×512 JPG q75 | Always far, plus tiled |
| **HDR** | IBL environment | 2K HDR, ~2 MB | `Environment` only loads from one URL; smaller HDRs lose specular detail. 2K is the sweet spot. |

Each `useTexture` call gets the right tier path. Concrete and tile use `RepeatWrapping` 2-4× so 512px reads as 1K-2K equivalent at the surface size.

### Mesh LOD

Following the same logic:

- **BT-1875**: full geometry (existing) — beveled edges, full leg geometry, weld bead curves. Currently ≈12k tris, well within budget.
- **Background prep tables**: SKIP the bevel modifier (sharp edges OK at distance), fewer leg segments (8 instead of 16). ≈2k tris each.
- **Exhaust hood**: simple beveled box + duct cylinder. ≈800 tris.
- **Wall shelving**: 4 boxes total. ≈100 tris.
- **Utensils**: 4 hanging objects, each ≈50 tris (low-poly silhouettes only — they're ambient detail).
- **Walls/floor**: 4 quads. 8 tris each, 32 total.

**Total kitchen scene polycount target: <20k tris**. Decoded GLB <500KB.

### Lazy-loading topology

Strict 3-tier load:

1. **First paint (no extra JS/assets)**: loader + design system + hero copy + canvas with `<Suspense fallback={<HeroPosterFallback/>}>`. No 3D fetches yet.
2. **PerfGate allows mount** (deviceMemory ≥ 4, 4G): the Lazy3D-wrapped `HeroCanvas` chunk lands. This triggers:
   - HDR fetch (parallel)
   - workstation GLB fetch (already done by v1)
   - PBR texture sets fetch (parallel)
3. **Scroll progress ≥ 0.3** (entering Form stage): kitchen.glb fetch begins. Until it lands, the scene shows just the wireframe-workstation transitioning to PBR — the kitchen pops in by the time we reach Form/Edge.

`HeroKitchenScene` uses `useGLTF.preload('/3d/kitchen.glb')` triggered by a `useEffect` that runs only when stage ≥ 1 (Heat). This way the GLB is fetched while the user is still in the Heat stage so it's ready by Form.

### Instancing

Pendants (3) and utensils (4): use `<InstancedMesh>` so each set is one draw call. Saves 5 draw calls + their state changes.

### Component refactor

```
src/components/hero/
├── HeroCanvas.tsx              ← Add <EffectComposer> chain
├── HeroEnvironment.tsx         ← Replace fake plane with real HDR + concrete floor
├── HeroKitchenScene.tsx        ← NEW: loads kitchen.glb, applies PBR textures
├── HeroPendantLights.tsx       ← NEW: 3 emissive spheres + 3 GodRays
├── HeroWorkstation.tsx         ← Keep wireframe shader for Earth/Heat; the kitchen.glb takes over from Form
├── HeroLights.tsx              ← Trim to 2 directional + ambient (env map carries IBL)
├── HeroSceneFurnish.tsx        ← DELETE (replaced by kitchen.glb)
├── HeroDust.tsx                ← DELETE (replaced by FogExp2 + GodRays)
└── HeroPostFX.tsx              ← NEW: EffectComposer with all effects
```

### Render-loop additions

- `useFrame` scrubs DoF `target` per stage:
  - Earth/Heat: large focal length, wide aperture → everything sharp
  - Form: focus on workstation, mid bokeh
  - Edge: shallow DoF, bokeh on background pendants
  - Place: focus on workstation, slight bokeh on far walls
- Bloom intensity ramps up during Heat (rust emissive on wireframe edges glows) and stays subtle during Place
- GodRays for pendants only enable from Form onwards

---

## 4. Blender pipeline (`scripts/blender/build-kitchen.py`)

Single script that builds the complete scene. Run as `blender --background --python scripts/blender/build-kitchen.py`.

### Scene contents

| Element | Geometry | Material | Notes |
|---|---|---|---|
| BT-1875 workstation | Re-built from existing helpers | Brushed steel PBR | Same as today |
| Polished concrete floor | 8m × 8m plane | Concrete PBR | UV-mapped 2× tiling |
| Back wall | 6m × 3m plane | Tile PBR | UV-mapped 4×2 tiling |
| Side wall | 4m × 3m plane (L-shape with back) | Plaster matte | Single tile |
| Overhead exhaust hood | Box 2m × 1m × 0.6m with bevel + duct cylinder | Brushed steel | Above BT-1875 |
| Hood ducting | Cylinder Ø0.4m × 2m | Brushed steel | Up through ceiling |
| Wall shelving (2 shelves) | Boxes 1.8m × 0.3m × 0.025m + L-brackets | Brushed steel | Above prep area |
| Second prep table | Smaller BT-1875 (1.4m × 0.7m) | Brushed steel | Background-left |
| Third prep table | 1.2m × 0.6m | Brushed steel | Background-right |
| 3 pendant lights | Cylinder Ø0.18m × 0.25m housing + Ø0.12m emissive disc | Steel housing + emissive base | Hanging at y=3.5m |
| Hanging utensil rail | Long cylinder + 4 hook primitives | Brushed steel | Above the workstation |
| 4 utensils (ladle, whisk, tongs, knife handle) | Simple primitives | Brushed steel | Hanging from the rail |

### UV mapping
- Smart UV project on all walls/floor for natural tiling
- Cube projection on the box geometry
- Per-mesh UV channels so each material maps correctly

### Export
- GLB with Draco mesh compression level 6
- Skip texture embedding (textures live in `public/tex/`)
- Export vertex normals + UVs only; no animations
- Target: <500 KB GLB

---

## 5. Three.js runtime — concrete code

### 5.1 Install packages

```bash
npm install @react-three/postprocessing postprocessing
```

### 5.2 Renderer settings (HeroCanvas)

```tsx
<Canvas
  camera={{ position: [0, 8, 0.01], fov: 35 }}
  dpr={[1, 2]}
  gl={{
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.4,
    outputColorSpace: THREE.SRGBColorSpace,
  }}
  frameloop="always"
>
```

### 5.3 IBL environment

```tsx
import { Environment } from "@react-three/drei";

<Suspense fallback={null}>
  <Environment
    files="/3d/env/kiara_interior_2k.hdr"
    background={false}
    environmentIntensity={0.9}
  />
</Suspense>
```

### 5.4 Texture loading + application

```tsx
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const steelMaps = useTexture({
  map:           "/tex/steel/basecolor.jpg",
  normalMap:     "/tex/steel/normal.jpg",
  roughnessMap:  "/tex/steel/roughness.jpg",
  metalnessMap:  "/tex/steel/metalness.jpg",
});
steelMaps.map.colorSpace = THREE.SRGBColorSpace;
steelMaps.map.wrapS = steelMaps.map.wrapT = THREE.RepeatWrapping;
```

### 5.5 EffectComposer chain (HeroPostFX)

```tsx
import { EffectComposer, Bloom, DepthOfField, SSAO, ToneMapping, Vignette, SMAA, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";

<EffectComposer multisampling={0} disableNormalPass={false}>
  <SSAO
    blendFunction={BlendFunction.MULTIPLY}
    radius={0.18}
    intensity={20}
    samples={16}
    rings={4}
    distanceThreshold={1.0}
    distanceFalloff={0.5}
    rangeThreshold={0.5}
    rangeFalloff={0.1}
  />
  <Bloom
    luminanceThreshold={0.9}
    luminanceSmoothing={0.4}
    intensity={0.6}
    mipmapBlur
  />
  <DepthOfField
    focusDistance={0.012}
    focalLength={0.05}
    bokehScale={3}
    target={[0, 0.85, 0]}
  />
  <ChromaticAberration offset={[0.0006, 0.0006]} />
  <Vignette eskil={false} offset={0.15} darkness={0.55} />
  <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
  <SMAA />
</EffectComposer>
```

### 5.6 Atmospheric fog

```tsx
// In HeroCanvas, swap linear fog for exponential
<fogExp2 attach="fog" args={["#0F1419", 0.085]} />
```

### 5.7 God rays from pendants

```tsx
import { GodRays } from "@react-three/postprocessing";

<mesh ref={pendantA} position={[-1.2, 3.4, 0]}>
  <sphereGeometry args={[0.14, 16, 16]} />
  <meshBasicMaterial color={0xfff0d4} />
</mesh>

{pendantA.current && (
  <GodRays
    sun={pendantA.current}
    samples={50}
    density={0.92}
    decay={0.93}
    weight={0.4}
    exposure={0.36}
    clampMax={1}
  />
)}
```

### 5.8 Mobile fallback

- High-end (deviceMemory ≥ 8, 4G): full chain
- Mid-end (deviceMemory 4-7): skip SSAO + GodRays
- Low-end: skip `<HeroPostFX>` entirely

---

## 6. Asset download script

`scripts/download-hero-assets.sh` — single script that grabs all the CC0 assets. Idempotent. Run once before build.

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/public/3d/env" "$ROOT/public/tex/steel" "$ROOT/public/tex/concrete" "$ROOT/public/tex/tile"

dl() {
  local url="$1" out="$2"
  if [ -f "$out" ]; then echo "skip $out"; return; fi
  curl -sSL "$url" -o "$out"
  echo "ok $out"
}

# PolyHaven HDR (kiara interior, 2K)
dl "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/kiara_interior_2k.hdr" \
   "$ROOT/public/3d/env/kiara_interior_2k.hdr"

# AmbientCG Metal046A
TMPD=$(mktemp -d)
curl -sSL "https://ambientcg.com/get?file=Metal046A_1K-JPG.zip" -o "$TMPD/steel.zip"
unzip -j -o "$TMPD/steel.zip" "*Color*" "*Normal*GL*" "*Roughness*" "*Metalness*" \
  -d "$ROOT/public/tex/steel"
mv "$ROOT/public/tex/steel/Metal046A_1K-JPG_Color.jpg"     "$ROOT/public/tex/steel/basecolor.jpg"
mv "$ROOT/public/tex/steel/Metal046A_1K-JPG_NormalGL.jpg"  "$ROOT/public/tex/steel/normal.jpg"
mv "$ROOT/public/tex/steel/Metal046A_1K-JPG_Roughness.jpg" "$ROOT/public/tex/steel/roughness.jpg"
mv "$ROOT/public/tex/steel/Metal046A_1K-JPG_Metalness.jpg" "$ROOT/public/tex/steel/metalness.jpg"

# Concrete + tile blocks follow the same pattern
rm -rf "$TMPD"
```

---

## 7. Verification

After build:

1. **Visual**: `node scripts/sv-hero-scroll.mjs` captures 7 stages × 2 locales. Compare against v2 baseline.
2. **Perf**: Lighthouse on home; expect Bloom + DoF to keep FCP < 2s (HDR + textures lazy-loaded), 50-60fps interaction.
3. **Payload size**: `npm run size`. New `Lazy3D-kitchen-*.js` chunk < 200 KB.
4. **A11y**: Reduced-motion fallback drops to a single still-frame composition with no canvas.

---

## 8. Risks + mitigations

| Risk | Mitigation |
|---|---|
| HDR file fails to download | Preload with `<link rel="preload" as="fetch">`; ship a 256×128 JPG fallback that drei loads if HDR errors |
| Heavy post-processing crashes mid-tier mobiles | `<PerfGate>` already drops it |
| Texture maps cause flash-of-untextured-mesh | Wrap kitchen mesh in `<Suspense>` |
| GodRays + DoF together at 60fps borderline on Intel HD | SMAA at half-res, GodRays at 0.5× resolution, DoF kernelSize=MEDIUM |
| Token / agent budget | Break execution into 3 dispatches: assets, Blender, runtime |

---

## 9. Execution timeline

| Phase | Duration | Output |
|---|---|---|
| A — Asset download script + run it | 15 min | HDR + 9 texture maps in `public/` |
| B — Blender kitchen.py + GLB export | 45 min | `public/3d/kitchen.glb`, < 500 KB |
| C — Three.js runtime | 75 min | Render scene |
| D — Mobile fallback tuning + perf | 30 min | Verified `<PerfGate>` tiers |
| E — Visual QA + screenshots + push | 30 min | Telegram update |
| **Total** | **~3.5 hours** | |

---

## 10. What I'm NOT doing (and why)

- **WebGPU**: Three.js `WebGPURenderer` (r170) is GA but has known issues with envMap handling and the hardware-RT path is experimental TSL only. Plain WebGL2 + good post-processing is the right move.
- **Path tracing**: `three-gpu-pathtracer` is amazing for stills but seconds-per-frame. Not viable for scrubbed scroll.
- **Custom volumetric shader**: Adds 100s of GPU cycles per pixel. GodRays + ExpFog give 95% at 5% of the cost.
- **Sketchfab paid models**: Stayed CC0. We own everything we ship.

---

## 11. Ask of the user

Please confirm:

1. **Plan looks right** — full kitchen scene, real HDR + textures, EffectComposer chain, pendant god rays, exponential fog (no fake dust particles)
2. **OK to spend ~4 hours of session time** on this (with the understanding that it may need iteration after)
3. **Acceptable to ship ~4MB of additional assets** (HDR + textures), loaded behind `<Lazy3D>` so first-load JS is unaffected
4. **OK to add `@react-three/postprocessing` and `postprocessing`** to deps (~80 KB gzip in the lazy 3D chunk)

If yes — I execute Phase A immediately, then dispatch a Blender subagent for Phase B, then execute C/D/E. Will Telegram at each phase boundary.

If you want changes — tell me before I burn the tokens.
