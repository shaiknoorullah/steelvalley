# Steel Valley — Hero: "From Blueprint to Build"

**Date:** 2026-05-18
**Branch:** `redesign` (extends Plan 1–5 prep work)
**Status:** Approved. Ready for writing-plans.

This spec defines the home-page hero: a single pinned, scroll-driven 3D sequence that transforms a CAD blueprint into a finished stainless-steel workstation installed in a Jeddah kitchen. It bridges the brand story arc **Earth → Heat → Form → Edge → Place** in one continuous take and is the lead Awwwards moment.

---

## 0. Source-of-truth references

- Strategic spec: `docs/superpowers/specs/2026-05-18-steelvalley-redesign.md`
- Performance contract: same spec, §5
- Existing primitives: `src/ds/perf/Lazy3D.tsx`, `src/ds/perf/PerfGate.tsx` (Plan 5)
- CAD-style spec block reference (already designed): `tmp/sv-design/steelvalley/project/components/cad-spec-block.jsx`

---

## 1. Locked Decisions

| Topic | Decision |
|------|----------|
| Hero protagonist | **BT-1875 Banquet Work Table** — Steel Valley's signature commercial-kitchen workstation, the exact piece the CAD spec block references |
| Secondary asset | **Edge Monument** — modeled in parallel as a comparison/fallback asset, same shader rig |
| Pin commitment | **Full cinematic — 500vh pinned** (5 stages × 100vh each) |
| Stage breakdown | Earth 0–20%, Heat 20–40%, Form 40–60%, Edge 60–80%, Place 80–100% |
| Camera path | Orthographic top-down → 30° elevation → perspective dolly-in → close detail → mid-shot pull-back |
| Wireframe aesthetic | Pure CAD on void (`#0F1419` backdrop, white edges + barycentric line shader, dimension lines + leader callouts as SVG overlay in registration) |
| Transformation mechanism | **Single custom shader on a single mesh** with three scroll-scrubbed uniforms (no opacity tricks, no stacked geometry) |
| Typography overlay | **Five chapter headlines, one per stage**, cross-fading 180ms at stage boundaries; mono callouts swap in sync |
| Bilingual | Full Arabic + English per stage; camera yaw direction mirrors under `dir="rtl"` |
| Mobile fallback | Pin compresses to 300vh, arc compresses to Earth → Form → Place (3 stages); Heat + Edge become 0.4s sub-beats |
| Reduced motion | Skip pin entirely; render Stage 5 (Place) as static still + static headline + CTA |
| Skip affordance | Mono chip `press space to skip →` (top-right of pinned canvas, focusable) |
| Modeling tool | Blender 5.1 headless via `bpy` Python scripts (no GUI, reproducible, version-controlled) |
| Export format | GLB + Draco compression + JPEG 85% textures |
| Runtime stack | R3F + Drei (`useGLTF`) + custom shader via `onBeforeCompile` + GSAP ScrollTrigger (pin + scrub) |
| Perf gating | Wrapped in `<Lazy3D>` + `<PerfGate>` from Plan 5; low-perf / Save-Data / `prefers-reduced-motion` users get the static fallback automatically |
| Payload budget | <250 KB gzip total (GLB workstation ~120 KB + GLB edge monument ~30 KB + scene JS ~80 KB, all Lazy3D-loaded — not in first-load) |

---

## 2. The 5-Stage Arc (definitive)

**Copy authoring rule — Arabic is NOT a translation.** The English and Arabic columns below are independent native expressions of the same stage concept. Arabic copy is authored using the **Saudi Arabic copy toolkit** — Hijazi register, Quranic echoes (Surah Al-Hadid), Al-Mutanabbi/folk wisdom, craft dignity, Vision 2030 undertones, place-rooting. See memories `feedback-arabic-native-authoring` and `feedback-saudi-arabic-copy-strategy`. Native Saudi reviewer signs off before launch.

**Brand Arabic anthem line (sitewide, not just the hero):**

> **حديد جدّة، يطعم المملكة.**
> *("Jeddah's iron, feeds the Kingdom." — place-rooted, Vision-2030-coded, plays on the workshop supplying kitchens that in turn feed Saudis. Designed to be untranslatable — the English brand line "we shape steel into spaces that feed cities" stands on its own; this is the Arabic-native equivalent that lives parallel to it, never derived from it.)*

| Scroll % | Stage | Camera | Geometry / Shader | Material | Headline (EN — native) | Headline (AR — native, with cultural references) | Mono callout |
|---------|-------|--------|-------------------|----------|--------------|--------------|--------------|
| 0–20 | **Earth** | Orthographic top-down (camera Y +10, looking down), no perspective | `u_wireframe = 1.0`, faces invisible. Edges render with barycentric line shader (`fwidth(barycentric)` line weight). SVG overlay drops dimension lines + leader callouts in registration with the mesh. | Edges in `--bone` `#F2F0EC` on `--void` `#0F1419`. No material yet. | `raw stainless. measured twice.` | `في الورشة، يبدأ الحديد بالقياس، لا بالصوت.` | `304 · 1.2mm · #4` |
| 20–40 | **Heat** | Tilts to 30° elevation; gentle dolly +1 unit | `u_wireframe = 1.0 → 0.0`. `u_heat = 0 → 1 → 0` (spike). Vertex-colored weld groups emit rust `#E2611B`. Sparks: 200 instanced points with scripted alpha decay (no physics). | Edges glow rust at weld vertices. Faces still off. | `fire knows the seam.` | `النار تعرف اللُّحام، ونحن نعرف وقتها.` | `weld · TIG · 1800°C` |
| 40–60 | **Form** | Continues to 45° elevation, gentle 15° yaw orbit | `u_wireframe = 0`, `u_pbrFill = 0 → 1`. Faces fade in via custom `onBeforeCompile` injection into `MeshStandardMaterial`. | Brushed stainless PBR emerges (anisotropic spec from a vertically-tiled scratch normal map). | `the shop builds the part.` | `صنعةٌ، تليق بالمكان.` | `1800 × 750 × 850 mm` |
| 60–80 | **Edge** | Dolly close to the front-left corner; bullnose + adjustable foot fill the frame | Full PBR. `u_pbrFill = 1`. | Rust-orange rim light rakes across the polished surface (raking spotlight + tonemapping). Bullnose radius readable. | `the edge is the promise.` | `في الحدّ، شدّةٌ ووعد.` | `R6 bullnose · weld bead Ø3` |
| 80–100 | **Place** | Pull back to mid-shot, frame includes a soft contact shadow + a layered kitchen plate behind | Full PBR + `ContactShadows` from Drei. Kitchen plate is a single AVIF image fade-in **(user-supplied; stock placeholder shipped until launch)**, no full 3D environment — keeps payload tight. | Warm kitchen lighting bake; chef hand silhouette fades in at 95% as a still photo layer (also user-supplied; placeholder until launch). CTA button materializes at the end. | `let us build your edge.` → **CTA: get a quote** | `حدّك، نصنعه.` → **CTA: اطلب عرض سعرك** | `jeddah · since 2005` |

**Why each Arabic line lands (for the reviewer):**

- **Earth** — *"In the workshop, iron begins with measurement, not with noise."* Saudi craft humility: real craftsmen measure, they don't announce. The contrast `بالقياس، لا بالصوت` (measurement, not noise) is the Hijazi merchant ethic — quiet competence. Sets the brand's posture from word one.

- **Heat** — *"The fire knows the weld; and we know its time."* Echoes the universally-known Arab proverb "اطرق الحديد ما دام حامياً" (strike the iron while it's hot) — without quoting it. The "ونحن نعرف وقتها" (and we know its time) inserts the human partnership: the fire reads the metal, we read the fire. Pride without arrogance.

- **Form** — *"A craft, worthy of its place."* Two-word Arabic line (plus comma-pause), tight as a hammered nail. **صنعة** (sun'a, craft) is the dignity word — never **إنتاج** (production), which is industrial-cold. **يليق** (worthy of) carries hospitality reverence — your kitchen, your hotel, your hospital deserves the right piece.

- **Edge** — *"In the edge: strength, and a promise."* This is the line where we quietly echo **Surah Al-Hadid 57:25**: "وَأَنْزَلْنَا الْحَدِيدَ فِيهِ بَأْسٌ شَدِيدٌ وَمَنَافِعُ لِلنَّاسِ" — "We sent down iron, in which is great power and many benefits for mankind." The word **شدّة** (shidda, strength) echoes **بأس شديد** (great power) without quoting it. Every Saudi recognizes Surah Al-Hadid; the recognition is the point. Reverent without preaching.

- **Place** — *"Your edge, we craft it. — Request your quote."* Possessive warmth (**حدّك** / your edge), the craft verb **نصنعه** (we craft it, from صنع — the dignity word again), and the standard Saudi B2B CTA **اطلب عرض سعرك** (request your quote — with possessive). Direct, but Saudi-relational.

**Launch gate:** every Arabic string above goes through native Saudi copywriter review before launch. Tracked in `docs/prep-status.md` as a blocking item. AI-authored first-pass is acceptable for design + dev; production requires human Saudi review.

### Cross-fade timing
- Headline (EN/AR): 180ms cross-fade at every stage boundary (0%, 20%, 40%, 60%, 80%).
- Mono callout: same 180ms cross-fade in lockstep.
- All driven by GSAP timeline waypoints, not separate ScrollTriggers — keeps them perfectly sync'd.

---

## 3. Architecture

This is a **Hybrid Pattern (R3F + GSAP Timelines)** from the meta-skill: scroll progress is captured by a single GSAP ScrollTrigger with `pin: true` and `scrub: 1`; the progress value is fed into a Zustand store; R3F components read the store and update shader uniforms in `useFrame` without triggering React re-renders.

```
HomePage (Server Component)
└── HeroPinSection (Client Component)
    ├── <Lazy3D fallback={<HeroPosterFallback />}>
    │   └── <PerfGate fallback={<HeroPosterFallback />}>
    │       └── <HeroCanvas>           ← R3F Canvas
    │           ├── <HeroLights />
    │           ├── <HeroWorkstation /> ← uses useGLTF + custom shader
    │           ├── <HeroSparks />      ← instancedMesh, mounted only during Heat
    │           └── <HeroEnvironment /> ← Drei ContactShadows; AVIF kitchen plate
    ├── <HeroOverlay />                ← 5 stage headlines + mono callouts + skip chip
    │                                    Reads from useHeroProgress (Zustand)
    └── <HeroScrollDriver />           ← GSAP ScrollTrigger; writes to useHeroProgress
```

### State store (Zustand)

```ts
// src/components/hero/useHeroProgress.ts
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface HeroProgress {
  progress: number;     // 0..1, scrubbed from ScrollTrigger
  stage: 0 | 1 | 2 | 3 | 4;     // derived: 0=Earth, 4=Place
  set: (p: number) => void;
}

export const useHeroProgress = create<HeroProgress>()(
  subscribeWithSelector((set) => ({
    progress: 0,
    stage: 0,
    set: (p) => set({
      progress: p,
      stage: Math.min(4, Math.floor(p * 5)) as 0 | 1 | 2 | 3 | 4,
    }),
  })),
);
```

### Scroll driver

```ts
// src/components/hero/HeroScrollDriver.tsx
"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useHeroProgress } from "./useHeroProgress";

gsap.registerPlugin(ScrollTrigger);

export function HeroScrollDriver({ pinSelector }: { pinSelector: string }) {
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const set = useHeroProgress((s) => s.set);

  useGSAP(() => {
    triggerRef.current = ScrollTrigger.create({
      trigger: pinSelector,
      start: "top top",
      end: "+=500%",       // 500vh of scroll for the full arc
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => set(self.progress),
      invalidateOnRefresh: true,
    });
    return () => triggerRef.current?.kill();
  }, []);

  return null;
}
```

### Shader integration (R3F)

```tsx
// src/components/hero/HeroWorkstation.tsx (key parts only — full code in Plan 6)
"use client";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useHeroProgress } from "./useHeroProgress";
import * as THREE from "three";

useGLTF.preload("/3d/bt-1875.glb");

export function HeroWorkstation() {
  const { scene } = useGLTF("/3d/bt-1875.glb");
  const matRef = useRef<THREE.MeshStandardMaterial>();
  const uniforms = useRef({
    u_wireframe: { value: 1.0 },
    u_pbrFill: { value: 0.0 },
    u_heat: { value: 0.0 },
  }).current;

  // Attach uniforms to the GLB's PBR material via onBeforeCompile
  useEffect(() => {
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial) {
        matRef.current = o.material;
        o.material.onBeforeCompile = (shader) => {
          shader.uniforms.u_wireframe = uniforms.u_wireframe;
          shader.uniforms.u_pbrFill = uniforms.u_pbrFill;
          shader.uniforms.u_heat = uniforms.u_heat;
          // varying barycentric for line rendering
          shader.vertexShader = shader.vertexShader.replace(
            "#include <common>",
            `#include <common>
             attribute vec3 a_bary;
             varying vec3 v_bary;`,
          ).replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
             v_bary = a_bary;`,
          );
          shader.fragmentShader = shader.fragmentShader.replace(
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
          ).replace(
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
        o.material.transparent = true;
        o.material.needsUpdate = true;
      }
    });
  }, [scene, uniforms]);

  // Scrub uniforms from store every frame (no React re-render)
  useFrame(() => {
    const { progress, stage } = useHeroProgress.getState();
    // Earth (0-0.2): wireframe full, pbr 0
    // Heat (0.2-0.4): wireframe stays, heat ramps up then back down
    // Form (0.4-0.6): wireframe fades out, pbr fades in
    // Edge (0.6-0.8): pbr full
    // Place (0.8-1.0): pbr full + environment
    const wireframe = THREE.MathUtils.smoothstep(progress, 0.4, 0.55);
    const pbr = THREE.MathUtils.smoothstep(progress, 0.4, 0.6);
    const heatRamp = stage === 1
      ? Math.sin(((progress - 0.2) / 0.2) * Math.PI)
      : 0;
    uniforms.u_wireframe.value = 1.0 - wireframe;
    uniforms.u_pbrFill.value = pbr;
    uniforms.u_heat.value = heatRamp;
  });

  return <primitive object={scene} />;
}
```

### Camera path

```tsx
// src/components/hero/HeroCameraRig.tsx
"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useHeroProgress } from "./useHeroProgress";
import * as THREE from "three";

const WAYPOINTS = [
  { p: 0.00, pos: [0, 8, 0.01], look: [0, 0, 0], fov: 35 },   // Earth top-down (near-ortho)
  { p: 0.20, pos: [2.5, 6, 4],  look: [0, 0.8, 0], fov: 40 }, // Heat 30°
  { p: 0.50, pos: [3.5, 3, 5],  look: [0, 0.8, 0], fov: 45 }, // Form 45°
  { p: 0.70, pos: [1.5, 1.2, 2.2], look: [0.5, 0.85, 0.5], fov: 35 }, // Edge close
  { p: 1.00, pos: [3, 2, 4.5], look: [0, 0.8, 0], fov: 45 },  // Place mid-shot
];

function lerp(a: number[], b: number[], t: number) {
  return a.map((v, i) => v + (b[i] - v) * t);
}

export function HeroCameraRig({ rtl = false }: { rtl?: boolean }) {
  const camera = useThree((s) => s.camera);

  useFrame(() => {
    const p = useHeroProgress.getState().progress;
    // Find the surrounding waypoints
    let i = 0;
    while (i < WAYPOINTS.length - 1 && WAYPOINTS[i + 1].p < p) i++;
    const a = WAYPOINTS[i], b = WAYPOINTS[Math.min(i + 1, WAYPOINTS.length - 1)];
    const t = (p - a.p) / Math.max(1e-6, b.p - a.p);
    const pos = lerp(a.pos, b.pos, t);
    const look = lerp(a.look, b.look, t);
    const fov = a.fov + (b.fov - a.fov) * t;

    // RTL mirror: invert X
    camera.position.set(rtl ? -pos[0] : pos[0], pos[1], pos[2]);
    camera.lookAt(rtl ? -look[0] : look[0], look[1], look[2]);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
```

---

## 4. Blender Pipeline

### Reproducible via Python (no GUI)

Two scripts live in the repo. They are run via `blender --background --python <script> -- --output <path>`. The CI step in Plan 5 also runs them on every PR that touches them, so the GLBs in `public/3d/` stay in sync with the source-of-truth code.

```
scripts/blender/
  ├── build-bt1875.py        ← models the workstation, exports public/3d/bt-1875.glb
  ├── build-edge-monument.py ← models the edge specimen, exports public/3d/edge-monument.glb
  └── _bpy_utils.py          ← shared: barycentric attribute injector, weld vertex paint, Draco export presets
```

### Modeling approach (BT-1875 — all hard-surface primitives)

Blender unit convention: **1 BU = 1 meter** (the bpy default). All dimensions below are real-world mm; multiply by 0.001 when calling `bpy.ops.mesh.primitive_cube_add(size=...)`. The exported GLB inherits the same scale.

| Part | Primitive | Dimensions | Modifiers |
|------|-----------|-----------|-----------|
| Top | Cube → Bevel edges R6 | 1800 × 750 × 28 mm | Bevel (R6, segments=4), Solidify (1.2mm) |
| Apron | Cube | 1780 × 730 × 14 mm | offset 12mm inset below top |
| Legs (×4) | Cylinder | Ø50 × 808 mm | corners of apron |
| Adjustable feet (×4) | Cylinder + sphere cap | Ø60 × 40 mm | bottom of each leg |
| Mid-shelf | Plane | 1700 × 700 × 1 mm | mid-height, optional toggle |
| Weld beads (16) | Tube curve | Ø3, ~80mm each | at leg-to-apron joints |

### Material setup (Principled BSDF for glTF compatibility)

- Base Color: `#C7CDD6` (steel)
- Metallic: 1.0
- Roughness: 0.32 (anisotropic via tangent-space normal map for brushed effect)
- Normal: vertically-tiled scratch map (procedural-baked to image, 1024×1024)
- IOR: 1.45

### Vertex color attribute for weld groups

A custom Python step paints vertices within 5mm of any weld curve with `red = 1.0`. This drives the `u_heat` emissive in the shader without needing a separate texture.

### Barycentric attribute injection

The shader needs barycentric coordinates per vertex to compute the wireframe edge mask. We **un-share** all vertices (split every triangle) and add a `a_bary` attribute with values `(1,0,0)`, `(0,1,0)`, `(0,0,1)` per triangle. This roughly 3× the vertex count, but the model stays well under the 12k-tri budget.

### Export settings

```python
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    export_apply=True,
    export_colors=True,                 # vertex colors for weld groups
    export_image_format='JPEG',
    export_jpeg_quality=85,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=8,
    export_draco_position_quantization=12,
    export_draco_normal_quantization=8,
    export_draco_texcoord_quantization=10,
    export_lights=False,
    export_cameras=False,
)
```

Target sizes after Draco: BT-1875 ~120 KB, Edge Monument ~30 KB.

---

## 5. Accessibility

- **`prefers-reduced-motion`** → `<PerfGate>` reports motion-reduced; the Hero renders the **static Place still** + the static headline `we shape steel into spaces that feed cities.` / `نشكّل الفولاذ إلى فضاءات تُطعم المدن.` + CTA. No pin, no scroll-driven anything.
- **Skip affordance** — top-right `mono · press space to skip →` chip, focusable, accessible name "Skip the hero animation". Pressing Space (or clicking) jumps `window.scrollTo` past the pin end.
- **Keyboard scroll** — `↓` advances ~100vh per press inside the pin (one stage per press, paced 300ms via smooth scroll).
- **Screen reader** — the 5 chapter headlines render in DOM order inside a visually-hidden `<ol>` so screen readers get the full narrative. The 3D canvas has `aria-hidden="true"`.
- **Focus order** — Skip chip → Hero CTA at Place (focusable only when reached) → next section. No focus traps inside the canvas.
- **Color contrast** — bone-on-void wireframe is 14:1; PBR steel-on-void in Place still passes 4.5:1 against any caption overlay.

---

## 6. Performance Contract

| Metric | Budget | How |
|--------|--------|-----|
| Combined payload (GLB + scene JS) | <250 KB gzip | Draco compression + Lazy3D + JPEG textures |
| First-load JS (per spec §5) | <180 KB | Lazy3D means the hero stack is NOT in first-load |
| LCP | <2.0s | LCP element is the static headline (stage 0) — text, not the canvas |
| INP | <200ms | useFrame writes to refs, no React re-renders; ScrollTrigger throttles at 60fps |
| Frame rate | 60fps desktop, 30fps mobile | `dpr={[1, 2]}`, `frameloop="always"` (scrub requires it); `<AdaptiveDpr>` from Drei drops DPR on perf decline |

`<PerfGate>` denies mount on: `deviceMemory < 4`, non-`4g` connection, `Save-Data` on, `prefers-reduced-motion`. Fallback in all these cases: the Place still image.

---

## 7. Bilingual Behavior

- All five stage headlines have **independently-authored** English and Arabic strings (see §2 table) — never translations. Stored in `messages/ar.json` and `messages/en.json` under `Hero.Stage*.headline`. The Payload `pages` collection treats the localized fields as independent authoring surfaces, not source-and-translation.
- Mono callouts stay LTR even inside Arabic (`direction: ltr; unicode-bidi: embed`) per the Refined Industrial spec — numerals + units.
- Camera yaw mirrors via `rtl` prop on `<HeroCameraRig>` (camera X coordinates flip sign in RTL).
- Skip chip is positioned with `insetInlineEnd: 1rem` (logical property) — flips automatically.
- **Launch gate:** every Arabic string in the project must be reviewed by a native Saudi copywriter before launch. The Quote Builder, lead-magnet popup, email templates, and all page copy fall under this gate. The first pass can be AI-authored (with the Arabic-first principle); the review is non-negotiable. Tracked in `docs/prep-status.md` as a blocking pre-launch item.

---

## 8. Out of Scope (v1)

- Sound design / VO (could be added in v2; keep audio context closed for autoplay safety)
- Multiple product variants beyond BT-1875 (the Edge Monument is the only secondary asset)
- Real chef-hand-in-frame video (a static photo composite is used)
- Physics for spark particles (instanced points + scripted alpha decay is enough)
- Three.js post-processing (no bloom, no SSAO, no tonemapping passes beyond the renderer default — keeps the JS tight)
- A B-test variant swapping in the Edge Monument (deferred; design lets us do this with a single asset-URL swap)

---

## 9. Files this spec introduces

```
scripts/blender/
  build-bt1875.py                                ← Blender bpy modeling script
  build-edge-monument.py                          ← Blender bpy modeling script
  _bpy_utils.py                                   ← shared helpers (bary, weld paint, Draco export)

public/3d/
  bt-1875.glb                                     ← built artifact (committed; rebuild via npm run build:assets)
  edge-monument.glb                               ← built artifact

src/components/hero/
  HeroPinSection.tsx                              ← server-component wrapper
  HeroCanvas.tsx                                  ← R3F Canvas inside Lazy3D + PerfGate
  HeroWorkstation.tsx                             ← GLB loader + shader injection
  HeroEdgeMonument.tsx                            ← parallel asset (lazy)
  HeroLights.tsx                                  ← lighting setup
  HeroSparks.tsx                                  ← instancedMesh particles (Heat only)
  HeroEnvironment.tsx                             ← ContactShadows + kitchen plate
  HeroCameraRig.tsx                               ← waypoint-interpolated camera
  HeroOverlay.tsx                                 ← 5 headlines + mono callouts + skip chip
  HeroPosterFallback.tsx                          ← static still for reduced-motion / low-perf
  HeroScrollDriver.tsx                            ← GSAP ScrollTrigger + Zustand bridge
  useHeroProgress.ts                              ← Zustand store

src/components/hero/__tests__/
  useHeroProgress.test.ts                         ← unit
  HeroCameraRig.test.ts                           ← waypoint interpolation unit

messages/
  ar.json                                         ← Hero.* keys added
  en.json                                         ← Hero.* keys added

scripts/
  build-assets.ts                                 ← npm script: runs both Blender scripts headless
```

---

## 10. Success Criteria

- The pinned hero arc reads coherently from 0% to 100% scroll. The story arc (Earth → Heat → Form → Edge → Place) is unmistakable to a viewer who has never seen the brand before.
- Stage transitions feel locked, not laggy. 60fps target on desktop, 30fps acceptable on mobile fallback.
- `prefers-reduced-motion` users see the full headline + CTA + a strong still — no degraded experience, just a different one.
- Combined GLB + scene JS payload ≤250 KB gzip.
- A11y: keyboard navigable; the 5 headlines are accessible to screen readers as text in DOM order; canvas is `aria-hidden`.
- The Blender scripts are reproducible: anyone running `npm run build:assets` from a clean checkout gets byte-identical GLBs.
- The Edge Monument secondary asset is swappable for the workstation via a single asset URL change — no shader/code rewrite.
