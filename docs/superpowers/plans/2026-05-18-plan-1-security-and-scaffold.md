# Steel Valley — Plan 1: Security & Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rotate the leaked Airtable API key, scrub `.env` from git history, create the `redesign` branch, upgrade to Next.js 15, and stand up the App Router alongside the existing Pages Router so future plans have a clean foundation.

**Architecture:** Two parallel concerns: (1) destructive history rewrite — gated on user approval at every step because pushing rewritten history affects the remote; (2) non-destructive scaffolding — branch creation, dependency upgrade, App Router co-existence with Pages Router (Next 15 supports both during migration).

**Tech Stack:** git-filter-repo, Next.js 15, React 19, TypeScript 5, App Router.

**Spec reference:** `docs/superpowers/specs/2026-05-18-steelvalley-redesign.md` §11 Phase 0-1.

**End-state test:** From a clean clone of the `redesign` branch with a fresh `.env.local`, `npm install && npm run dev` boots, `http://localhost:3000/` serves the existing site (Pages Router), `http://localhost:3000/_app-router-health` serves a 200 from a new App Router route, and `git log --all --full-history -- .env` returns nothing.

---

## Task 1: Audit current secret exposure

**Files:**
- Read: `.env`, `.gitignore`

- [ ] **Step 1: Identify what's leaked**

Run: `git log --all --full-history --oneline -- .env`
Expected: at least one commit hash listed where `.env` was added.

Run: `git show <first-hash>:.env`
Expected: contents of the leaked file printed. Record the leaked keys (AIRTABLE_API_KEY, AIRTABLE_BASE_ID).

- [ ] **Step 2: Confirm `.gitignore` gap**

Run: `grep -n '^\.env' .gitignore`
Expected: only `.env*.local` shown — confirming bare `.env` is NOT ignored.

- [ ] **Step 3: Confirm presence on remote**

Run: `git ls-remote origin`
Then: `git log origin/main --full-history --oneline -- .env`
Expected: commits with `.env` appear on the remote too.

- [ ] **Step 4: Hand off to user for key rotation**

Output to user:

```
SECURITY ACTION REQUIRED — do this before continuing:
1. Log into Airtable → Account → Developer hub → Personal access tokens.
2. Revoke the token starting with: <print first 8 chars of AIRTABLE_API_KEY>
3. Generate a new token with the same scopes (read on the Steel Valley base).
4. Paste the new token back to me. I'll put it in .env.local — NOT .env.
5. Confirm here when revocation is done so I can proceed with history scrub.
```

**Do not proceed to Task 2 until the user has confirmed both revocation and provided a new token.**

- [ ] **Step 5: Commit gate (no commit yet — this task is investigation only)**

No commit. Move to Task 2.

---

## Task 2: Fix `.gitignore` and seed `.env.local` + `.env.example`

**Files:**
- Modify: `.gitignore`
- Create: `.env.example`
- Create (local only, NOT committed): `.env.local`

- [ ] **Step 1: Update `.gitignore` to cover bare `.env`**

Edit `.gitignore`. Find the line:

```
# local env files
.env*.local
```

Replace with:

```
# local env files
.env
.env.*
!.env.example
```

This ignores every variant of `.env` while allowing `.env.example` to be tracked.

- [ ] **Step 2: Create `.env.example` with all required keys, no secrets**

Create `.env.example`:

```bash
# Airtable (legacy — will be removed after migration in Plan 4)
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=

# Set by future plans — listed here so devs know what's coming
# Supabase
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_S3_ENDPOINT=
SUPABASE_S3_REGION=
SUPABASE_S3_ACCESS_KEY_ID=
SUPABASE_S3_SECRET_ACCESS_KEY=

# Payload
PAYLOAD_SECRET=
PAYLOAD_PUBLIC_SERVER_URL=

# Resend (transactional email)
RESEND_API_KEY=

# OpenPanel
NEXT_PUBLIC_OPENPANEL_CLIENT_ID=
OPENPANEL_CLIENT_SECRET=

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

- [ ] **Step 3: Create local `.env.local` with the freshly rotated Airtable token**

Tell the user to create `.env.local` (you can't write it for them safely; they paste the secret):

```
Create /home/devsupreme/work/steelvalley/.env.local with:

AIRTABLE_API_KEY=<the new token you just generated>
AIRTABLE_BASE_ID=<existing base id is fine — that's not secret>
```

Confirm the file exists:

Run: `test -f .env.local && echo "ok" || echo "missing"`
Expected: `ok`

- [ ] **Step 4: Verify `.env.local` is git-ignored**

Run: `git check-ignore -v .env.local`
Expected: output showing the ignore rule matched (e.g., `.gitignore:N:.env.*\t.env.local`).

Run: `git status --short .env.local`
Expected: empty output (file is ignored).

- [ ] **Step 5: Commit gitignore + example**

Run:

```bash
git add .gitignore .env.example
git commit -m "chore(security): tighten .gitignore and add .env.example

- Ignore .env and .env.* (was only .env*.local — bare .env was tracked)
- Document required env vars in .env.example
- Prep for git history scrub of leaked .env in next task"
```

---

## Task 3: Install `git-filter-repo`

**Files:** none

- [ ] **Step 1: Check if installed**

Run: `git filter-repo --version 2>/dev/null || echo "not installed"`

- [ ] **Step 2: Install if missing**

If "not installed", install via pacman (Arch):

```bash
sudo pacman -S --noconfirm git-filter-repo
```

Confirm: `git filter-repo --version`
Expected: version string like `git-filter-repo 2.45.0`.

- [ ] **Step 3: No commit**

This is a tool install, not a repo change.

---

## Task 4: Scrub `.env` from git history (DESTRUCTIVE — user-gated)

**Files:** repository history (the whole repo)

> **STOP. This rewrites history. Before proceeding, confirm with the user:**
> 1. New Airtable token is active.
> 2. Old Airtable token is REVOKED.
> 3. All collaborators are aware that history will be rewritten and they'll need to re-clone or `git reset --hard origin/<branch>` after the force-push.
>
> Only proceed when user explicitly says "scrub history" or equivalent.

- [ ] **Step 1: Back up the repo**

Run:

```bash
cd /home/devsupreme/work
cp -r steelvalley steelvalley-backup-$(date +%Y%m%d-%H%M%S)
cd steelvalley
```

Confirm the backup exists:

```bash
ls -d /home/devsupreme/work/steelvalley-backup-* | tail -1
```

- [ ] **Step 2: Confirm clean working tree**

Run: `git status`
Expected: "working tree clean" (the `.gitignore` + `.env.example` commit from Task 2 should be the latest).

- [ ] **Step 3: Run filter-repo to remove .env from all history**

Run:

```bash
git filter-repo --path .env --invert-paths --force
```

Expected: output showing rewriting commits, ends with "Repacking your repo..." and no errors.

- [ ] **Step 4: Verify .env is gone from history**

Run: `git log --all --full-history --oneline -- .env`
Expected: empty output.

Run: `git log --all --full-history --oneline -- .env.example`
Expected: shows the commit from Task 2 (still present, as intended).

- [ ] **Step 5: filter-repo strips the remote — re-add it**

filter-repo intentionally drops the `origin` remote as a safety measure.

Run: `git remote -v`
Expected: empty.

Re-add (replace with the actual URL — confirm with user if uncertain; check the backup):

```bash
BACKUP_DIR=$(ls -d /home/devsupreme/work/steelvalley-backup-* | tail -1)
git remote add origin $(grep -m1 'url = ' "$BACKUP_DIR/.git/config" | awk '{print $3}')
git remote -v
```

If the URL extraction fails, the user must provide it. Confirm:

```bash
git remote get-url origin
```

Expected: the GitHub URL `https://github.com/shaiknoorullah/steelvalley.git` or similar.

- [ ] **Step 6: Force-push rewritten history (USER GATE)**

> **STOP. Confirm with user one more time before force-pushing.**
> Output: "Ready to force-push rewritten main to origin. This affects everyone who has cloned this repo. Confirm to proceed."

When user confirms:

```bash
git push origin main --force-with-lease
```

Expected: push succeeds. `--force-with-lease` rejects the push if the remote was updated since the last fetch (safer than `--force`).

- [ ] **Step 7: Tell collaborators**

Output to user:

```
History rewrite complete and pushed. Notify any collaborators:

> Steel Valley main has had .env removed from history. To sync:
>   git fetch origin
>   git reset --hard origin/main
> Or simpler: re-clone. Local branches off old main will need rebasing.
```

- [ ] **Step 8: No new commit — history is the change**

The force-push IS the commit.

---

## Task 5: Create `redesign` branch off cleaned `main`

**Files:** none (branch op)

- [ ] **Step 1: Verify you're on main and synced**

Run: `git branch --show-current`
Expected: `main`

Run: `git status`
Expected: clean.

- [ ] **Step 2: Create and switch to redesign branch**

Run:

```bash
git checkout -b redesign
git branch --show-current
```

Expected: `redesign`

- [ ] **Step 3: Push the branch and set upstream**

Run:

```bash
git push -u origin redesign
```

Expected: branch created on remote, upstream set.

Run: `git branch -vv`
Expected: `redesign` line shows `[origin/redesign]`.

---

## Task 6: Upgrade Next.js to 15 + React 19 + verify build still works

**Files:**
- Modify: `package.json`
- Modify: `next.config.mjs` (if exists) / `next.config.js`
- Modify: `tsconfig.json`

- [ ] **Step 1: Read current next.config and tsconfig**

Run: `ls next.config.*`
Note which file exists.

Run: `cat tsconfig.json`
Note the current compiler options.

- [ ] **Step 2: Use the Next.js codemod to upgrade**

Next provides an official codemod that updates package.json + handles breaking changes.

Run:

```bash
npx @next/codemod@canary upgrade latest
```

When prompted, accept the latest stable Next.js 15 (and React 19 if offered).

Expected: package.json is updated; some codemods may run on existing code.

- [ ] **Step 3: Verify package.json picked up Next 15 + React 19**

Run: `grep -E '"(next|react|react-dom)"' package.json`
Expected:
- `"next": "15.x.x"` or `"^15.x.x"`
- `"react": "19.x.x"` or `"^19.x.x"`
- `"react-dom": "19.x.x"` or `"^19.x.x"`

If the codemod skipped React, manually install:

```bash
npm install react@19 react-dom@19 @types/react@19 @types/react-dom@19
```

- [ ] **Step 4: Install everything fresh**

Run:

```bash
rm -rf node_modules .next
npm install
```

Expected: clean install, no peer-dep errors that aren't expected (some Three.js packages may warn — those are non-fatal).

- [ ] **Step 5: Tighten tsconfig for strict mode**

Edit `tsconfig.json`. Ensure `compilerOptions` includes at minimum:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "target": "ES2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  }
}
```

Preserve any existing `include`/`exclude`. Don't downgrade options that were already stricter.

- [ ] **Step 6: Run typecheck to find breakages**

Run: `npx tsc --noEmit`
Expected: some errors are likely (this project hasn't had `noUncheckedIndexedAccess` enabled before; React 19's type changes may also surface).

For each error, the rule is:
- If it's a real bug, fix it.
- If it's a strictness false-positive in **existing** code that we're going to delete in later plans (the existing Pages Router components), suppress with a `// @ts-expect-error` and a short comment pointing at the plan that retires it.

Record any `@ts-expect-error` you add in a list at the bottom of `docs/prep-status.md` (you'll create that file in Task 10).

- [ ] **Step 7: Verify the existing site still builds**

Run: `npm run build`
Expected: build succeeds. Warnings are OK; errors aren't.

If errors remain, fix them or suppress per Step 6 logic.

- [ ] **Step 8: Verify dev server starts and existing site renders**

Run (in background): `npm run dev`

Wait for "Ready" line, then in another shell:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/
```

Expected: `200`

Stop the dev server.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.* src/
git commit -m "feat(scaffold): upgrade to Next.js 15 + React 19, tighten tsconfig

- Run @next/codemod upgrade
- Strict mode + noUncheckedIndexedAccess
- Path alias @/* for src/*
- Existing Pages Router still builds and serves"
```

---

## Task 7: Add App Router skeleton alongside Pages Router

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx` — **does NOT replace Pages Router `index.tsx`**; Pages Router takes precedence on `/`, so this file is a placeholder that won't actually serve until later plans rewire root
- Create: `src/app/_app-router-health/page.tsx` — the route we'll use to verify App Router is alive without conflicting with Pages Router
- Create: `src/app/globals.css` — empty for now, just so layout imports cleanly

- [ ] **Step 1: Create `src/app/layout.tsx`**

```tsx
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Steel Valley",
  description: "Stainless steel fabrication — Jeddah, Saudi Arabia.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
```

(`lang="ar" dir="rtl"` is the default per the spec — Arabic-first. Will be made dynamic in Plan 2 when next-intl lands.)

- [ ] **Step 2: Create `src/app/page.tsx` (placeholder, won't serve while Pages Router has `index.tsx`)**

```tsx
export default function AppRouterRootPlaceholder() {
  return (
    <main>
      <h1>App Router root placeholder</h1>
      <p>This will not render while Pages Router src/pages/index.tsx exists.</p>
    </main>
  );
}
```

- [ ] **Step 3: Create `src/app/_app-router-health/page.tsx`**

This is the route the end-state test hits. Pages Router has no matching file, so App Router serves it.

```tsx
export const dynamic = "force-static";

export default function AppRouterHealth() {
  return (
    <main>
      <h1>App Router is alive.</h1>
      <p>If you can read this, the Next 15 App Router scaffold works.</p>
    </main>
  );
}
```

- [ ] **Step 4: Create empty `src/app/globals.css`**

```css
/* Plan 3 (design system tokens) will fill this in. */
```

- [ ] **Step 5: Write a smoke test for the health route**

Install Vitest + supertest-style HTTP client (if not present):

Run: `npm install -D vitest @vitest/coverage-v8`

Create `tests/app-router-health.test.ts`:

```ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

let dev: ChildProcess;

beforeAll(async () => {
  dev = spawn("npm", ["run", "dev"], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: "3001" },
  });

  // Wait for "Ready" on stdout, max 30s
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("dev server timeout")), 30_000);
    dev.stdout!.on("data", (chunk: Buffer) => {
      if (chunk.toString().includes("Ready")) {
        clearTimeout(timer);
        resolve();
      }
    });
  });

  // Belt and braces — give Next a moment after "Ready"
  await wait(500);
}, 60_000);

afterAll(() => {
  dev?.kill("SIGTERM");
});

describe("Next 15 App Router scaffold", () => {
  it("serves /_app-router-health with the placeholder body", async () => {
    const res = await fetch("http://localhost:3001/_app-router-health");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("App Router is alive.");
  });

  it("still serves the existing Pages Router root", async () => {
    const res = await fetch("http://localhost:3001/");
    expect(res.status).toBe(200);
  });
});
```

Add the test script. In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: Run the test — expect it to PASS now**

Run: `npm test`

Expected: both tests pass. (We're in the unusual position of writing the test after the route, because the test relies on the route already existing. Acceptable for scaffold-verification tests.)

If the test fails because the dev server didn't boot in time, increase the timeout or check for build errors in the dev output.

- [ ] **Step 7: Commit**

```bash
git add src/app tests/app-router-health.test.ts package.json package-lock.json
git commit -m "feat(scaffold): add Next 15 App Router skeleton alongside Pages Router

- src/app/layout.tsx with Arabic-first defaults (lang=ar dir=rtl)
- src/app/_app-router-health/page.tsx as a verification route
- Pages Router src/pages/* continues to serve unchanged
- Vitest smoke test confirms App Router serves and Pages Router still works"
```

---

## Task 8: Add `src/app` to tsconfig include + verify build

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Verify tsconfig includes src/app**

Open `tsconfig.json`. Look at the `include` array.

If it's `["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]` or already covers `src/**`, no change needed.

If it's narrower (e.g., only `src/pages`), expand to:

```json
"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: clean (or only the pre-existing suppressed errors from Task 6).

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: succeeds. Look at the build output — it should list both Pages Router routes (`/`, `/aboutus`, `/products`, etc.) and the new App Router route (`/_app-router-health`).

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: green.

- [ ] **Step 5: Commit (only if tsconfig changed)**

If tsconfig was updated in Step 1:

```bash
git add tsconfig.json
git commit -m "chore(scaffold): widen tsconfig include for src/app"
```

If no change, skip the commit.

---

## Task 9: Add a `.editorconfig` and confirm `.prettierrc` exists

**Files:**
- Create (if missing): `.editorconfig`
- Read: `.prettierrc` or `prettier.config.*`

- [ ] **Step 1: Check if editorconfig exists**

Run: `test -f .editorconfig && echo exists || echo missing`

- [ ] **Step 2: If missing, create it**

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 3: Check Prettier config**

Run: `ls .prettierrc* prettier.config.* 2>/dev/null`

If none exist, create `.prettierrc.json`:

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

And install Prettier:

Run: `npm install -D prettier`

Add to package.json `"scripts"`:

```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

- [ ] **Step 4: Run format check**

Run: `npm run format:check`
Expected: it lists files that don't match the format. Don't auto-format the existing Pages Router code yet — that's outside this plan's scope. Just confirm the tool runs.

- [ ] **Step 5: Commit (if changes)**

```bash
git add .editorconfig .prettierrc.json package.json package-lock.json
git commit -m "chore(scaffold): add editorconfig + prettier config"
```

Skip the commit if nothing changed.

---

## Task 10: Write `docs/prep-status.md`

**Files:**
- Create: `docs/prep-status.md`

- [ ] **Step 1: Create the status file**

```markdown
# Steel Valley redesign — prep status

Live status for the technical-prep work track. Updated at the end of every plan.

## Plans

| # | Plan | Status | Notes |
|---|------|--------|-------|
| 1 | Security & Scaffold | ✅ complete | Branch `redesign`, Next 15 + React 19, App Router alongside Pages Router |
| 2 | Backend Foundation (Payload + Supabase + i18n) | ⏸ pending | Blocked on Supabase project credentials |
| 3 | Design System + Primitives | ⏸ pending | Will absorb final tokens from Claude Design when they land |
| 4 | Conversion + Discovery | ⏸ pending | Resend API key required |
| 5 | Performance Scaffolding | ⏸ pending | |

## What runs locally today
- `npm install`
- `npm run dev` — serves the existing Pages Router site at http://localhost:3000
- `http://localhost:3000/_app-router-health` — confirms App Router is wired
- `npm test` — Vitest smoke test for the health route
- `npm run build` — both routers build

## What's blocked / waiting on user
- Supabase project + connection string (for Plan 2)
- Resend API key (for Plan 4)
- (No font handoff needed — Plan 5 ships free/OFL fonts that honour the spec: Saira Condensed, Inter, JetBrains Mono, Tajawal, IBM Plex Sans Arabic.)
- Lead-magnet PDF asset (for Plan 4 — placeholder PDF is fine until launch)
- Sales WhatsApp number for `NEXT_PUBLIC_WHATSAPP_NUMBER` (for Plan 4)
- Final OpenPanel client ID after project creation (for Plan 4)

## TypeScript suppressions added during Plan 1
(List any `@ts-expect-error` added during Task 6, Step 6. Each entry is `path:line — reason — retired in Plan N`.)

## Migration off Airtable
- Old key was leaked in git history and has been rotated + scrubbed.
- New key lives in `.env.local` (untracked).
- Airtable continues to power `main`. The `redesign` branch will use Payload after Plan 2 lands.
- Final cutover happens in Plan 4 (migration script) → user runs the script → verifies → kills Airtable.
```

- [ ] **Step 2: Commit**

```bash
git add docs/prep-status.md
git commit -m "docs: add prep-status tracker for redesign prep work"
```

---

## Task 11: Push `redesign` and verify end-state

**Files:** none

- [ ] **Step 1: Push the latest commits to the remote `redesign` branch**

Run:

```bash
git push origin redesign
```

Expected: succeeds, no rejected refs.

- [ ] **Step 2: Verify end-state on the local checkout**

Run:

```bash
git log --all --full-history -- .env
```

Expected: empty (no result).

Run:

```bash
git branch --show-current
```

Expected: `redesign`.

Run:

```bash
npm install
npm run build
```

Expected: build succeeds.

Run:

```bash
npm test
```

Expected: tests pass.

Run dev server, then in another shell:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/_app-router-health
```

Expected: both `200`.

Stop the dev server.

- [ ] **Step 3: No commit — verification only**

If everything above passed, Plan 1 is complete. Update `docs/prep-status.md` Plan 1 row from "✅ complete" to "✅ complete + pushed" and commit:

```bash
git add docs/prep-status.md
git commit -m "docs(prep-status): mark Plan 1 pushed"
git push origin redesign
```

---

## Plan 1 — done.

**End-state achieved:**
- Leaked Airtable token rotated and revoked.
- `.env` removed from all git history; force-pushed to origin.
- `.gitignore` covers all `.env*` variants.
- `.env.example` documents the keys future plans need.
- `redesign` branch exists on origin.
- Next.js 15 + React 19 installed.
- TypeScript in strict + noUncheckedIndexedAccess mode.
- App Router skeleton co-exists with Pages Router.
- `/_app-router-health` proves App Router serves; existing `/` proves Pages Router still serves.
- Vitest smoke test guards both.
- `docs/prep-status.md` tracks status across all 5 plans.

**Next:** Plan 2 — Backend Foundation (Payload v3 + Supabase + next-intl routing).
