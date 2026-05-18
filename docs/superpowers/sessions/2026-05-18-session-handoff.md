# Steel Valley — Session Handoff (2026-05-18)

**Pause reason:** User restarting PC. Resume cleanly from this doc.

---

## TL;DR for the resuming session

1. Read this file first.
2. Then read the two specs awaiting implementation: `docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md` and `docs/superpowers/specs/2026-05-18-loading-and-transitions.md`.
3. Then read `memory/MEMORY.md` and load both feedback memories (Arabic native authoring + Saudi copy strategy).
4. Then invoke `superpowers:writing-plans` to produce **Plan 6** (Hero Assets + Runtime) and **Plan 7** (Loader + Page Transitions). User has approved both specs.

---

## Project state

- **Repo:** `/home/devsupreme/work/steelvalley`
- **Current branch:** `main` (unchanged this session)
- **Target branch:** `redesign` (gets created in Plan 1 execution)
- **Working tree:** clean except for new docs under `docs/superpowers/` and `docs/prompts/` (not committed — per user's rule that I only commit on explicit ask)

## What's on disk (all approved)

```
docs/
├── prompts/
│   ├── claude-design-brief.md                 ← paste into Claude Design
│   └── technical-prep.md                      ← paste into a fresh Claude Code session
├── superpowers/
│   ├── specs/
│   │   ├── 2026-05-18-steelvalley-redesign.md          ← STRATEGIC spec
│   │   ├── 2026-05-18-hero-from-blueprint-to-build.md  ← HERO spec (approved)
│   │   └── 2026-05-18-loading-and-transitions.md       ← LOADER+TRANSITIONS spec (approved)
│   ├── plans/
│   │   ├── 2026-05-18-plan-1-security-and-scaffold.md       (11 tasks, ready to execute)
│   │   ├── 2026-05-18-plan-2-backend-foundation.md          (24 tasks)
│   │   ├── 2026-05-18-plan-3-design-system-and-primitives.md (20 tasks)
│   │   ├── 2026-05-18-plan-4-conversion-and-discovery.md    (17 tasks)
│   │   └── 2026-05-18-plan-5-performance-scaffolding.md     (8 tasks)
│   └── sessions/
│       └── 2026-05-18-session-handoff.md      ← this file
```

## Memory written this session

```
~/.claude/projects/-home-devsupreme-work-steelvalley/memory/
├── MEMORY.md                                  ← index
├── feedback_arabic_native_authoring.md        ← Arabic copy is never translated
└── feedback_saudi_arabic_copy_strategy.md     ← Hijazi register + Quranic echoes + Vision 2030 toolkit
```

Both are loaded automatically every session via `MEMORY.md`.

## What's approved (no further sign-off needed)

| Artifact | Status |
|---|---|
| Strategic spec (palette, IA, tech stack, perf contract, content model) | ✅ Approved |
| 5 prep plans (Plans 1–5) | ✅ Approved, ready to execute |
| Hero "From Blueprint to Build" spec | ✅ Approved (with Arabic re-authored using Saudi cultural toolkit) |
| Loading + transitions spec | ✅ Approved |
| Free font picks (Saira Condensed → Archivo Narrow / Inter / JetBrains Mono / Tajawal → IBM Plex Sans Arabic) | ✅ Decided (see below for the open question) |
| Arabic-native authoring rule | ✅ Approved + saved as durable memory |
| Brand Arabic anthem line: **حديد جدّة، يطعم المملكة.** | ✅ Approved |

## What needs writing-plans next (in this order)

1. **Plan 6 — Hero Assets + Runtime** (~25 tasks)
   - Blender bpy scripts for BT-1875 + Edge Monument
   - GLB build pipeline (`npm run build:assets`)
   - `<HeroPinSection>`, `<HeroCanvas>`, `<HeroWorkstation>`, `<HeroCameraRig>`, `<HeroOverlay>`, `<HeroSparks>`, `<HeroEnvironment>`, `<HeroPosterFallback>`
   - Custom shader injection via `onBeforeCompile` (the wireframe→PBR uniforms)
   - GSAP ScrollTrigger pin + scrub + Zustand bridge (`useHeroProgress`)
   - 5 chapter headlines + mono callouts (English + native Arabic)
   - Skip affordance + keyboard accessibility
   - Tests (Vitest for hooks; Playwright + axe for a11y)

2. **Plan 7 — Loader + Page Transitions** (~12 tasks)
   - `<MeasurementStampLoader>` + `<LoaderShell>` (with progress driver)
   - SVG dimension line growing 0→1800mm with load progress
   - `<TransitionStyles>` injecting CSS for `next-view-transitions`
   - RTL-aware cut direction
   - Reduced-motion fallbacks
   - `sessionStorage` skip-on-repeat-visit
   - Tests for the progress driver + a11y

Both plans are **independent** — they can run in parallel (different files, different surfaces). Plan 7 is much smaller.

## Plugin / skill state at pause

**Installed marketplaces:**
- `claude-plugins-official` (Anthropic)
- `freshtechbro/claudedesignskills` (3D + animation, 22 skills)
- `coreyhaines31/marketingskills` (40 marketing skills)
- `makash/great-web-copy` (copywriting skill + 2 slash commands)

**Total active at pause:** 44 plugins / 87 skills / 57 agents / 11 hooks / 10 MCP servers / 1 LSP server.

**Most load-bearing skills for upcoming work:**

| When | Skill |
|---|---|
| Plan 6 — Blender modeling scripts | `blender-web-pipeline:blender-web-pipeline` |
| Plan 6 — R3F shader work | `core-3d-animation:react-three-fiber` + `core-3d-animation:threejs-webgl` |
| Plan 6 — GSAP scroll pin | `core-3d-animation:gsap-scrolltrigger` |
| Plan 6 — integration architecture | `meta-skills:web3d-integration-patterns` |
| Plan 7 — View Transitions API | `vercel:nextjs` (App Router) + `meta-skills:modern-web-design` |
| When writing actual page copy (later) | `marketing-skills:copywriting`, `:cro`, `:marketing-psychology`, `:lead-magnets`, `:popups`, `:signup`, `:emails`, `:seo-audit`, `:ai-seo`, `:schema`, `:site-architecture` + `great-web-copy:write-copy` + `great-web-copy:audit-copy` |
| When writing Arabic copy | Above + memories `feedback-arabic-native-authoring` and `feedback-saudi-arabic-copy-strategy` (loaded automatically) |

## Open user-side actions (not blocking the next session)

These are gated on the user, not on the code. They surface as Plan-1 / Plan-2 / Plan-4 prerequisites when those plans execute:

- **Rotate Airtable API key** (Plan 1 Task 1 prompts for this)
- **Provide Supabase credentials** (Plan 2 Task 1 prompts)
- **Provide Resend API key + verified FROM email** (Plan 4 Task 1 prompts)
- **Provide OpenPanel client ID + secret** (Plan 4 Task 1 prompts)
- **Provide sales WhatsApp number** (Plan 4 Task 1 prompts)
- **Provide lead-magnet PDF** (Plan 4 Task 6 — placeholder works until launch)
- **Provide GitHub repo secrets `DATABASE_URL_TEST` + `PAYLOAD_SECRET_TEST`** (Plan 5 Task 6 — for CI)
- **Native Saudi copywriter review of all Arabic strings** (pre-launch gate, not blocking dev)
- **Photography for "Place" stage + chef-hand silhouette** (Plan 6 implementation — placeholder works until launch)
- **Kitchen plate AVIF image for hero stage 5** (Plan 6 implementation — placeholder works until launch)

## Open design questions parked

- **Font pick reconciliation.** Spec §2.2 says Saira Condensed; Claude Design used Archivo Narrow. I recommended switching to Archivo Narrow in chat (better match for Refined Industrial heavy condensed), but the spec on disk still says Saira Condensed. **Pending: user picks one, then we update spec + Plan 3 Task 2.** Not blocking — both are free OFL and behave the same in the token layer.
- **`marketing-skills` integration into Plan 4.** Plan 4 already covers conversion infrastructure but doesn't yet leverage the new copywriting skills. When the user is ready to author real page strings, the writer should invoke `marketing-skills:copywriting` + `marketing-skills:marketing-psychology` and the Arabic memories. Worth a small Plan-4 amendment OR a separate Plan 8 ("Copy + content authoring"). User to decide.

## How to resume after restart

In a new Claude Code session in `/home/devsupreme/work/steelvalley`, paste:

> "Resume the Steel Valley redesign. Read `docs/superpowers/sessions/2026-05-18-session-handoff.md` first, then invoke `superpowers:writing-plans` to produce Plan 6 (Hero Assets + Runtime) and Plan 7 (Loader + Page Transitions). Both specs are approved."

That single message gives the next session everything it needs.

## Notes about the work pace this session

- User is moving fast; favors decisive recommendations over open-ended exploration.
- User pushed back productively on Arabic-as-translation — produced two memory files capturing the principle and the Saudi-specific toolkit.
- User installed all the recommended marketplaces / plugins cleanly when given the corrected commands.
- User has approved everything currently on disk. Pause is purely operational (PC restart), not awaiting any input.

End of handoff. Resume cleanly. The work is good.
