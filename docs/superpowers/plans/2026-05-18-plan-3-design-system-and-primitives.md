# Steel Valley — Plan 3: Design System + Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Refined Industrial design token layer (Tailwind v4) and build every primitive component RTL-aware from day one, so when Claude Design's mockups arrive the work is a values-only swap, not a structural rewrite.

**Architecture:** Tailwind v4 CSS-first config holds the token layer; provisional values come from spec §2.1–§2.2 and §5 (motion). Primitives wrap Radix UI where it provides accessibility (Dialog, Tabs, Disclosure, Tooltip), and are hand-built where Radix doesn't cover (Stepper, Lightbox). Every primitive ships unstyled-with-data-attributes so Claude Design's final tokens layer in cleanly. A `/dev/components` route renders all primitives in both LTR and RTL for visual + a11y QA.

**Tech Stack:** Tailwind CSS v4, Radix UI primitives, react-hook-form + zod, axe-core for a11y tests, Vitest.

**Spec reference:** `docs/superpowers/specs/2026-05-18-steelvalley-redesign.md` §2, §5, §6, §11 Phase 4-5.

**Prerequisite:** Plan 2 complete. Payload + i18n live.

**End-state test:**
1. `npm run dev` boots.
2. Visit `http://localhost:3000/dev/components` → every primitive renders, in both LTR and RTL panes.
3. Tab through the page → focus ring is visible on every interactive primitive, ring color is rust (`#E2611B`), never absent.
4. `prefers-reduced-motion: reduce` → motion-tokened transitions collapse to instant.
5. `npm test` passes (a11y tests via axe-core, no critical violations).
6. `npm run build` succeeds.

---

## Task 1: Install Tailwind CSS v4 + utilities + Radix primitives + axe

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Tailwind v4 and runtime deps**

```bash
npm install tailwindcss@next @tailwindcss/postcss@next clsx class-variance-authority tailwind-merge
```

`class-variance-authority` and `tailwind-merge` are already present from earlier, but `npm install` will idempotently keep them.

- [ ] **Step 2: Install Radix primitives we'll wrap**

```bash
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-tooltip @radix-ui/react-toast @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-select @radix-ui/react-visually-hidden
```

- [ ] **Step 3: Install dev deps for a11y testing**

```bash
npm install -D axe-core @axe-core/playwright happy-dom @testing-library/react @testing-library/dom @testing-library/jest-dom
```

(We'll use happy-dom + Testing Library for component unit tests; Playwright + axe for page-level a11y assertions in Task 19.)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(design-system): install Tailwind v4, Radix primitives, a11y test tooling"
```

---

## Task 2: Configure Tailwind v4 with Refined Industrial tokens

**Files:**
- Create: `postcss.config.mjs` (replaces any v3 config)
- Modify: `src/app/globals.css`
- Delete: `tailwind.config.ts` or `tailwind.config.js` if present (v4 is CSS-first)

- [ ] **Step 1: Verify Tailwind v3 config exists and remove it**

Run: `ls tailwind.config.*`

If a file is listed, delete it:

```bash
rm tailwind.config.*
```

Tailwind v4 moves config into CSS.

- [ ] **Step 2: Write `postcss.config.mjs`**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Remove old `postcss.config.js` if present:

```bash
rm -f postcss.config.js
```

- [ ] **Step 3: Rewrite `src/app/globals.css` with the v4 token layer**

```css
@import "tailwindcss";

/*
  Refined Industrial — design tokens (provisional)
  Source of truth: docs/superpowers/specs/2026-05-18-steelvalley-redesign.md §2.1–§2.2
  Claude Design's final tokens replace the values; do not change variable NAMES.
*/

@theme {
  /* Palette */
  --color-ink: #0a0a0b;
  --color-graphite: #1f2937;
  --color-steel: #c7cdd6;
  --color-bone: #f2f0ec;
  --color-rust: #e2611b;
  --color-void: #0f1419;

  /* Type families */
  --font-display: var(--font-latin-display-loaded), "Saira Condensed", "Arial Narrow", system-ui, sans-serif;
  --font-body: var(--font-latin-body-loaded), "Inter", system-ui, sans-serif;
  --font-mono: var(--font-latin-mono-loaded), "JetBrains Mono", ui-monospace, "SF Mono", monospace;
  --font-arabic-display: var(--font-arabic-display-loaded), "Tajawal", system-ui, sans-serif;
  --font-arabic-body: var(--font-arabic-body-loaded), "IBM Plex Sans Arabic", system-ui, sans-serif;

  /* Spacing — 8px base (provisional) */
  --spacing-1: 0.5rem;
  --spacing-2: 1rem;
  --spacing-3: 1.5rem;
  --spacing-4: 2rem;
  --spacing-6: 3rem;
  --spacing-8: 4rem;
  --spacing-12: 6rem;

  /* Motion (provisional) */
  --duration-instant: 150ms;
  --duration-fast: 250ms;
  --duration-base: 350ms;
  --duration-slow: 600ms;

  --ease-standard: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --ease-enter: cubic-bezier(0, 0, 0.2, 1);

  /* Focus */
  --color-focus: var(--color-rust);
}

/* Direction-aware logical defaults */
html {
  font-family: var(--font-body);
}

html[lang="ar"] {
  font-family: var(--font-arabic-body);
}

html[lang="ar"] :is(h1, h2, h3, h4, h5, h6) {
  font-family: var(--font-arabic-display);
}

html:not([lang="ar"]) :is(h1, h2, h3, h4, h5, h6) {
  font-family: var(--font-display);
}

/* Focus ring — never removed */
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* Respect prefers-reduced-motion globally for token-driven transitions */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Body baseline */
body {
  background: var(--color-bone);
  color: var(--color-ink);
  margin: 0;
}
```

- [ ] **Step 4: Verify Tailwind compiles**

Run: `npm run build`
Expected: build succeeds. If errors complain about unknown `@theme` directive, ensure `tailwindcss@next` was installed (Tailwind 4.0+).

- [ ] **Step 5: Verify tokens are usable in a component**

Visit `http://localhost:3000/` (after `npm run dev`). The body should now have the bone background color (`#F2F0EC`).

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css postcss.config.mjs
git commit -m "feat(design-system): Tailwind v4 token layer with Refined Industrial provisional values

- Palette, type families, spacing, motion, focus tokens per spec §2
- Variable NAMES are stable; values are provisional pending Claude Design
- Global :focus-visible ring in rust, never removed
- prefers-reduced-motion collapses all token-driven transitions"
```

---

## Task 3: `cn()` utility + base lib

**Files:**
- Create: `src/lib/cn.ts`
- Read: `src/lib/utils.ts` (it may already contain `cn` from earlier)

- [ ] **Step 1: Read existing utils**

Run: `cat src/lib/utils.ts`

If `cn` is already exported there, skip Steps 2–3.

- [ ] **Step 2: If missing, create `src/lib/cn.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Commit (if a file was created)**

```bash
git add src/lib/cn.ts
git commit -m "chore(design-system): add cn() utility (clsx + tailwind-merge)"
```

---

## Task 4: `useReducedMotion` hook + `useMounted` hook

**Files:**
- Create: `src/lib/hooks/useReducedMotion.ts`
- Create: `src/lib/hooks/useMounted.ts`

- [ ] **Step 1: Create `useReducedMotion.ts`**

```ts
"use client";
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 2: Create `useMounted.ts`**

```ts
"use client";
import { useEffect, useState } from "react";

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
```

(Used to suppress SSR/CSR mismatch on direction-sensitive renders.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/hooks
git commit -m "feat(design-system): useReducedMotion and useMounted hooks"
```

---

## Task 5: `Button` and `IconButton` primitives

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/IconButton.tsx`
- Create: `src/components/ui/__tests__/Button.test.tsx`

- [ ] **Step 1: Move or replace the existing `Button.tsx`**

The current `src/components/ui/Button.tsx` lives under Pages Router. We don't want to touch it (Plan 1 said don't delete legacy). New ones go under a clearer path. Use a new directory:

```bash
mkdir -p src/ds/components
```

Going forward, all NEW design-system primitives live under `src/ds/components/`. Existing legacy primitives stay at `src/components/ui/` until launch.

- [ ] **Step 2: Create `src/ds/components/Button.tsx`**

```tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  // Base — unstyled-by-design except for focus + disabled. Visual layer comes from Claude Design.
  [
    "inline-flex items-center justify-center gap-2",
    "select-none cursor-pointer",
    "transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: "data-[variant=primary]",
        secondary: "data-[variant=secondary]",
        ghost: "data-[variant=ghost]",
      },
      size: {
        sm: "data-[size=sm]",
        md: "data-[size=md]",
        lg: "data-[size=lg]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      data-component="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={props.disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  ),
);
Button.displayName = "Button";
```

- [ ] **Step 3: Create `src/ds/components/IconButton.tsx`**

```tsx
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // accessible name — required, never decorative-only
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, icon, size = "md", className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      data-component="icon-button"
      data-size={size}
      className={cn(
        "inline-flex items-center justify-center",
        "transition-colors disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  ),
);
IconButton.displayName = "IconButton";
```

- [ ] **Step 4: Configure Vitest for happy-dom + Testing Library**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Write Button test**

Create `src/ds/components/__tests__/Button.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("forwards data attributes for variant and size", () => {
    render(<Button variant="ghost" size="lg">x</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("data-variant", "ghost");
    expect(btn).toHaveAttribute("data-size", "lg");
  });

  it("disables and sets aria-busy when loading", () => {
    render(<Button loading>x</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("defaults type=button (prevents accidental form submit)", () => {
    render(<Button>x</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("calls onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>x</Button>);
    screen.getByRole("button").click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 6: Run the test — expect green**

Run: `npm test -- Button`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src/ds/components/Button.tsx src/ds/components/IconButton.tsx src/ds/components/__tests__/Button.test.tsx vitest.config.ts vitest.setup.ts
git commit -m "feat(ds): Button and IconButton primitives + unit tests

- Headless with data-* hooks for design tokens
- IconButton requires accessible label (no icon-only without name)
- type=button default prevents accidental form submit"
```

---

## Task 6: `Link` and `LocaleLink` primitives

**Files:**
- Create: `src/ds/components/Link.tsx`
- Modify: `src/components/i18n/LocaleToggle.tsx` (re-export LocaleLink for callsites)
- Create: `src/ds/components/__tests__/Link.test.tsx`

- [ ] **Step 1: Create `src/ds/components/Link.tsx`**

```tsx
import { forwardRef, type AnchorHTMLAttributes } from "react";
import NextLink from "next/link";
import { Link as IntlLink } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export type LinkVariant = "inline" | "nav" | "cta";

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: LinkVariant;
  external?: boolean; // bypasses i18n routing
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, variant = "inline", external, className, children, ...props }, ref) => {
    const isExternal =
      external || /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

    if (isExternal) {
      return (
        <NextLink
          ref={ref as never}
          href={href}
          data-component="link"
          data-variant={variant}
          target={props.target ?? "_blank"}
          rel={props.rel ?? "noopener noreferrer"}
          className={cn(className)}
          {...props}
        >
          {children}
        </NextLink>
      );
    }

    return (
      <IntlLink
        ref={ref as never}
        href={href}
        data-component="link"
        data-variant={variant}
        className={cn(className)}
        {...props}
      >
        {children}
      </IntlLink>
    );
  },
);
Link.displayName = "Link";
```

`IntlLink` from `next-intl` automatically prepends the current locale for non-default-locale routes.

- [ ] **Step 2: Write a quick test**

Create `src/ds/components/__tests__/Link.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock next-intl routing — pre-import alias resolves to a stub
vi.mock("@/i18n/routing", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { Link } from "../Link";

describe("Link", () => {
  it("renders internal href via i18n Link", () => {
    render(<Link href="/about">About</Link>);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
  });

  it("renders external href with target=_blank and rel=noopener", () => {
    render(<Link href="https://example.com">Ext</Link>);
    const a = screen.getByRole("link", { name: "Ext" });
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("treats mailto as external", () => {
    render(<Link href="mailto:a@b.com">mail</Link>);
    expect(screen.getByRole("link", { name: "mail" })).toHaveAttribute("href", "mailto:a@b.com");
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npm test -- Link`
Expected: green.

- [ ] **Step 4: Commit**

```bash
git add src/ds/components/Link.tsx src/ds/components/__tests__/Link.test.tsx
git commit -m "feat(ds): Link primitive (next-intl-aware, auto-external handling)"
```

---

## Task 7: Form primitives — `Input`, `Textarea`, `Label`, `Field`

**Files:**
- Create: `src/ds/components/Input.tsx`
- Create: `src/ds/components/Textarea.tsx`
- Create: `src/ds/components/Label.tsx`
- Create: `src/ds/components/Field.tsx`

- [ ] **Step 1: Create `Input.tsx`**

```tsx
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, className, ...props }, ref) => (
    <input
      ref={ref}
      data-component="input"
      aria-invalid={invalid || undefined}
      className={cn("w-full", className)}
      {...props}
    />
  ),
);
Input.displayName = "Input";
```

- [ ] **Step 2: Create `Textarea.tsx`**

```tsx
import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ invalid, className, ...props }, ref) => (
    <textarea
      ref={ref}
      data-component="textarea"
      aria-invalid={invalid || undefined}
      className={cn("w-full", className)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
```

- [ ] **Step 3: Create `Label.tsx`**

```tsx
import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, className, children, ...props }, ref) => (
    <label
      ref={ref}
      data-component="label"
      data-required={required || undefined}
      className={cn(className)}
      {...props}
    >
      {children}
      {required ? <span aria-hidden="true" data-required-marker> *</span> : null}
    </label>
  ),
);
Label.displayName = "Label";
```

- [ ] **Step 4: Create `Field.tsx` — wraps Label + control + help/error text with proper ARIA wiring**

```tsx
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FieldProps {
  label: string;
  required?: boolean;
  help?: string;
  error?: string;
  children: (ids: { inputId: string; describedBy?: string }) => ReactNode;
  className?: string;
}

export function Field({ label, required, help, error, children, className }: FieldProps) {
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const helpId = help ? `${baseId}-help` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div data-component="field" className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={inputId} data-component="label">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children({ inputId, describedBy })}
      {help ? (
        <small id={helpId} data-component="field-help">
          {help}
        </small>
      ) : null}
      {error ? (
        <small id={errorId} role="alert" data-component="field-error">
          {error}
        </small>
      ) : null}
    </div>
  );
}
```

Usage:

```tsx
<Field label="Email" required error={errors.email?.message}>
  {({ inputId, describedBy }) => (
    <Input id={inputId} aria-describedby={describedBy} {...register("email")} />
  )}
</Field>
```

- [ ] **Step 5: Write a quick test for Field**

Create `src/ds/components/__tests__/Field.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Field } from "../Field";
import { Input } from "../Input";

describe("Field", () => {
  it("associates label, input, help, and error via ids", () => {
    render(
      <Field label="Email" help="We don't share." error="Required">
        {({ inputId, describedBy }) => (
          <Input id={inputId} aria-describedby={describedBy} />
        )}
      </Field>,
    );

    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(screen.getByText("Required")).toHaveAttribute("role", "alert");
  });
});
```

- [ ] **Step 6: Run tests**

Run: `npm test -- Field`
Expected: green.

- [ ] **Step 7: Commit**

```bash
git add src/ds/components/Input.tsx src/ds/components/Textarea.tsx src/ds/components/Label.tsx src/ds/components/Field.tsx src/ds/components/__tests__/Field.test.tsx
git commit -m "feat(ds): Input, Textarea, Label, Field primitives (ARIA-wired)"
```

---

## Task 8: `Checkbox`, `RadioGroup`, `RadioCard` (Radix wrappers)

**Files:**
- Create: `src/ds/components/Checkbox.tsx`
- Create: `src/ds/components/RadioGroup.tsx`
- Create: `src/ds/components/RadioCard.tsx`

- [ ] **Step 1: Create `Checkbox.tsx`**

```tsx
"use client";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as RC from "@radix-ui/react-checkbox";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends ComponentPropsWithoutRef<typeof RC.Root> {}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, children, ...props }, ref) => (
    <RC.Root
      ref={ref}
      data-component="checkbox"
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <RC.Indicator data-component="checkbox-indicator">
        {children ?? <span aria-hidden="true">✓</span>}
      </RC.Indicator>
    </RC.Root>
  ),
);
Checkbox.displayName = "Checkbox";
```

- [ ] **Step 2: Create `RadioGroup.tsx`**

```tsx
"use client";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as RG from "@radix-ui/react-radio-group";
import { cn } from "@/lib/cn";

export const RadioGroup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof RG.Root>>(
  ({ className, ...props }, ref) => (
    <RG.Root ref={ref} data-component="radio-group" className={cn("flex flex-col gap-2", className)} {...props} />
  ),
);
RadioGroup.displayName = "RadioGroup";

export const RadioGroupItem = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof RG.Item>>(
  ({ className, ...props }, ref) => (
    <RG.Item ref={ref} data-component="radio-item" className={cn("inline-flex items-center", className)} {...props}>
      <RG.Indicator data-component="radio-indicator" />
    </RG.Item>
  ),
);
RadioGroupItem.displayName = "RadioGroupItem";
```

- [ ] **Step 3: Create `RadioCard.tsx` — bigger touch target, holds rich content**

```tsx
"use client";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as RG from "@radix-ui/react-radio-group";
import { cn } from "@/lib/cn";

interface RadioCardProps extends ComponentPropsWithoutRef<typeof RG.Item> {
  title: ReactNode;
  description?: ReactNode;
}

export const RadioCard = forwardRef<HTMLButtonElement, RadioCardProps>(
  ({ title, description, className, value, ...props }, ref) => (
    <RG.Item
      ref={ref}
      value={value}
      data-component="radio-card"
      className={cn("text-start", className)}
      {...props}
    >
      <span data-component="radio-card-title">{title}</span>
      {description ? <span data-component="radio-card-description">{description}</span> : null}
      <RG.Indicator data-component="radio-card-indicator" />
    </RG.Item>
  ),
);
RadioCard.displayName = "RadioCard";
```

`text-start` is logical (RTL-aware); `text-left` would be wrong.

- [ ] **Step 4: Commit**

```bash
git add src/ds/components/Checkbox.tsx src/ds/components/RadioGroup.tsx src/ds/components/RadioCard.tsx
git commit -m "feat(ds): Checkbox, RadioGroup, RadioCard (Radix wrappers, RTL-safe)"
```

---

## Task 9: `Select` (Radix wrapper)

**Files:**
- Create: `src/ds/components/Select.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as S from "@radix-ui/react-select";
import { cn } from "@/lib/cn";

export const Select = S.Root;
export const SelectValue = S.Value;

export const SelectTrigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof S.Trigger>>(
  ({ className, children, ...props }, ref) => (
    <S.Trigger
      ref={ref}
      data-component="select-trigger"
      className={cn("inline-flex items-center justify-between", className)}
      {...props}
    >
      {children}
      <S.Icon aria-hidden="true" data-component="select-icon">▾</S.Icon>
    </S.Trigger>
  ),
);
SelectTrigger.displayName = "SelectTrigger";

export const SelectContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof S.Content>>(
  ({ className, children, ...props }, ref) => (
    <S.Portal>
      <S.Content
        ref={ref}
        data-component="select-content"
        position="popper"
        sideOffset={4}
        className={cn("z-50", className)}
        {...props}
      >
        <S.Viewport>{children}</S.Viewport>
      </S.Content>
    </S.Portal>
  ),
);
SelectContent.displayName = "SelectContent";

export const SelectItem = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof S.Item>>(
  ({ className, children, ...props }, ref) => (
    <S.Item ref={ref} data-component="select-item" className={cn("cursor-pointer", className)} {...props}>
      <S.ItemText>{children}</S.ItemText>
      <S.ItemIndicator data-component="select-item-indicator" aria-hidden="true">✓</S.ItemIndicator>
    </S.Item>
  ),
);
SelectItem.displayName = "SelectItem";
```

- [ ] **Step 2: Commit**

```bash
git add src/ds/components/Select.tsx
git commit -m "feat(ds): Select primitive (Radix wrapper)"
```

---

## Task 10: `Form` — react-hook-form + zod adapter

**Files:**
- Create: `src/ds/components/Form.tsx`

- [ ] **Step 1: Install resolvers (already present from earlier — verify)**

Run: `grep '"@hookform/resolvers"' package.json`
Expected: a version present. If missing: `npm install @hookform/resolvers`.

- [ ] **Step 2: Create `Form.tsx`**

```tsx
"use client";
import { FormProvider, useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { FormHTMLAttributes, ReactNode } from "react";

interface FormProps<TSchema extends z.ZodTypeAny>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "children"> {
  schema: TSchema;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  onSubmit: (values: z.infer<TSchema>) => void | Promise<void>;
  children: ReactNode;
}

export function Form<TSchema extends z.ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  children,
  ...formProps
}: FormProps<TSchema>) {
  const methods = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  return (
    <FormProvider {...methods}>
      <form
        data-component="form"
        noValidate
        onSubmit={methods.handleSubmit(onSubmit)}
        {...formProps}
      >
        {children}
      </form>
    </FormProvider>
  );
}
```

Consumers call `useFormContext<typeof schema>()` to get `register`, `formState`, etc.

- [ ] **Step 3: Commit**

```bash
git add src/ds/components/Form.tsx
git commit -m "feat(ds): Form primitive (react-hook-form + zod resolver, FormProvider)"
```

---

## Task 11: `Stepper` — multi-step container with progress + URL-hash sync

**Files:**
- Create: `src/ds/components/Stepper.tsx`
- Create: `src/ds/components/__tests__/Stepper.test.tsx`

- [ ] **Step 1: Create `Stepper.tsx`**

```tsx
"use client";
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

interface StepperContextValue {
  current: number;
  total: number;
  goNext: () => void;
  goPrev: () => void;
  goTo: (i: number) => void;
}

const StepperContext = createContext<StepperContextValue | null>(null);

export function useStepper() {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error("useStepper must be used inside a <Stepper>");
  return ctx;
}

interface StepperProps {
  steps: number;
  initial?: number;
  syncHash?: string; // e.g. "step" → reflects as #step-1, #step-2 in the URL
  children: ReactNode;
  onChange?: (index: number) => void;
}

export function Stepper({ steps, initial = 0, syncHash, children, onChange }: StepperProps) {
  const [current, setCurrent] = useState(initial);

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.min(Math.max(i, 0), steps - 1);
      setCurrent(clamped);
      onChange?.(clamped);
      if (syncHash && typeof window !== "undefined") {
        window.location.hash = `${syncHash}-${clamped + 1}`;
      }
    },
    [steps, syncHash, onChange],
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Initialise from URL hash (back-button support)
  useEffect(() => {
    if (!syncHash || typeof window === "undefined") return;
    const m = window.location.hash.match(new RegExp(`^#${syncHash}-(\\d+)$`));
    if (m && m[1]) {
      const target = parseInt(m[1], 10) - 1;
      if (!Number.isNaN(target)) setCurrent(target);
    }
    const onHash = () => {
      const m2 = window.location.hash.match(new RegExp(`^#${syncHash}-(\\d+)$`));
      if (m2 && m2[1]) {
        const t = parseInt(m2[1], 10) - 1;
        if (!Number.isNaN(t)) setCurrent(t);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [syncHash]);

  return (
    <StepperContext.Provider value={{ current, total: steps, goNext, goPrev, goTo }}>
      <div data-component="stepper" data-current={current + 1} data-total={steps}>
        {children}
      </div>
    </StepperContext.Provider>
  );
}

export function StepperStep({ index, children }: { index: number; children: ReactNode }) {
  const { current } = useStepper();
  const active = current === index;
  return (
    <div
      data-component="stepper-step"
      data-active={active || undefined}
      hidden={!active}
      aria-hidden={!active}
    >
      {children}
    </div>
  );
}

export function StepperProgress() {
  const { current, total } = useStepper();
  return (
    <div
      data-component="stepper-progress"
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      <span data-component="stepper-progress-label">
        step {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Write a test**

Create `src/ds/components/__tests__/Stepper.test.tsx`:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Stepper, StepperStep, StepperProgress, useStepper } from "../Stepper";

function Nav() {
  const { goNext, goPrev } = useStepper();
  return (
    <>
      <button onClick={goPrev}>prev</button>
      <button onClick={goNext}>next</button>
    </>
  );
}

describe("Stepper", () => {
  it("shows only the active step and advances on next", () => {
    render(
      <Stepper steps={3}>
        <StepperProgress />
        <StepperStep index={0}>one</StepperStep>
        <StepperStep index={1}>two</StepperStep>
        <StepperStep index={2}>three</StepperStep>
        <Nav />
      </Stepper>,
    );

    expect(screen.getByText("one")).toBeVisible();
    expect(screen.queryByText("two")).not.toBeVisible();

    fireEvent.click(screen.getByText("next"));

    expect(screen.queryByText("one")).not.toBeVisible();
    expect(screen.getByText("two")).toBeVisible();

    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveAttribute("aria-valuenow", "2");
  });

  it("clamps at boundaries", () => {
    render(
      <Stepper steps={2}>
        <StepperStep index={0}>a</StepperStep>
        <StepperStep index={1}>b</StepperStep>
        <Nav />
      </Stepper>,
    );

    fireEvent.click(screen.getByText("prev")); // already at 0
    expect(screen.getByText("a")).toBeVisible();

    fireEvent.click(screen.getByText("next"));
    fireEvent.click(screen.getByText("next")); // already at end
    expect(screen.getByText("b")).toBeVisible();
  });
});
```

- [ ] **Step 3: Run test**

Run: `npm test -- Stepper`
Expected: green.

- [ ] **Step 4: Commit**

```bash
git add src/ds/components/Stepper.tsx src/ds/components/__tests__/Stepper.test.tsx
git commit -m "feat(ds): Stepper with URL-hash sync, ARIA progressbar, clamping"
```

---

## Task 12: `Dialog` / `Modal` (Radix wrapper with focus trap)

**Files:**
- Create: `src/ds/components/Dialog.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as D from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogPortal = D.Portal;
export const DialogClose = D.Close;

export const DialogOverlay = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof D.Overlay>>(
  ({ className, ...props }, ref) => (
    <D.Overlay
      ref={ref}
      data-component="dialog-overlay"
      className={cn("fixed inset-0 z-40", className)}
      {...props}
    />
  ),
);
DialogOverlay.displayName = "DialogOverlay";

interface DialogContentProps extends ComponentPropsWithoutRef<typeof D.Content> {
  title: string; // required for accessible name
  description?: string;
  hideTitle?: boolean;
  children: ReactNode;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, title, description, hideTitle, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <D.Content
        ref={ref}
        data-component="dialog-content"
        className={cn("fixed inset-0 z-50 flex items-center justify-center p-4", className)}
        {...props}
      >
        <div data-component="dialog-panel">
          {hideTitle ? (
            <D.Title asChild>
              <span className="sr-only">{title}</span>
            </D.Title>
          ) : (
            <D.Title data-component="dialog-title">{title}</D.Title>
          )}
          {description ? (
            <D.Description data-component="dialog-description">{description}</D.Description>
          ) : null}
          {children}
        </div>
      </D.Content>
    </DialogPortal>
  ),
);
DialogContent.displayName = "DialogContent";
```

Radix Dialog handles focus trap, Escape to close, and focus return automatically.

- [ ] **Step 2: Commit**

```bash
git add src/ds/components/Dialog.tsx
git commit -m "feat(ds): Dialog/Modal (Radix wrapper with built-in focus trap)"
```

---

## Task 13: `Lightbox` — hand-built, keyboard-navigable image viewer

**Files:**
- Create: `src/ds/components/Lightbox.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import * as D from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  startIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Lightbox({ images, startIndex = 0, open, onOpenChange }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const total = images.length;

  useEffect(() => {
    if (open) setIndex(startIndex);
  }, [open, startIndex]);

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  // Keyboard nav inside the lightbox
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  if (total === 0) return null;
  const current = images[index]!;

  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay data-component="lightbox-overlay" className="fixed inset-0 z-40 bg-black/80" />
        <D.Content
          data-component="lightbox-content"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            closeButtonRef.current?.focus();
          }}
        >
          <D.Title className="sr-only">
            Image {index + 1} of {total}
          </D.Title>
          <D.Description className="sr-only">{current.caption ?? current.alt}</D.Description>

          <D.Close
            ref={closeButtonRef}
            aria-label="Close"
            data-component="lightbox-close"
            className={cn("absolute end-4 top-4")}
          >
            ✕
          </D.Close>

          <button
            type="button"
            aria-label="Previous"
            onClick={prev}
            data-component="lightbox-prev"
            className="absolute start-4 top-1/2 -translate-y-1/2"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={next}
            data-component="lightbox-next"
            className="absolute end-4 top-1/2 -translate-y-1/2"
          >
            ›
          </button>

          <figure data-component="lightbox-figure">
            <img src={current.src} alt={current.alt} />
            {current.caption ? (
              <figcaption data-component="lightbox-caption">{current.caption}</figcaption>
            ) : null}
          </figure>

          <div data-component="lightbox-counter" aria-hidden="true">
            {index + 1} / {total}
          </div>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
```

`start-4`/`end-4` are logical (RTL-aware); the arrows flip naturally with the document direction.

- [ ] **Step 2: Commit**

```bash
git add src/ds/components/Lightbox.tsx
git commit -m "feat(ds): Lightbox with keyboard nav, focus trap, RTL-safe positioning"
```

---

## Task 14: `Accordion` / `Disclosure` and `Tabs` (Radix wrappers)

**Files:**
- Create: `src/ds/components/Accordion.tsx`
- Create: `src/ds/components/Tabs.tsx`

- [ ] **Step 1: Create `Accordion.tsx`**

```tsx
"use client";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as A from "@radix-ui/react-accordion";
import { cn } from "@/lib/cn";

export const Accordion = A.Root;

export const AccordionItem = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof A.Item>>(
  ({ className, ...props }, ref) => (
    <A.Item ref={ref} data-component="accordion-item" className={cn(className)} {...props} />
  ),
);
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof A.Trigger>>(
  ({ className, children, ...props }, ref) => (
    <A.Header data-component="accordion-header">
      <A.Trigger
        ref={ref}
        data-component="accordion-trigger"
        className={cn("flex w-full items-center justify-between", className)}
        {...props}
      >
        {children}
      </A.Trigger>
    </A.Header>
  ),
);
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof A.Content>>(
  ({ className, ...props }, ref) => (
    <A.Content ref={ref} data-component="accordion-content" className={cn(className)} {...props} />
  ),
);
AccordionContent.displayName = "AccordionContent";
```

- [ ] **Step 2: Create `Tabs.tsx`**

```tsx
"use client";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as T from "@radix-ui/react-tabs";
import { cn } from "@/lib/cn";

export const Tabs = T.Root;

export const TabsList = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof T.List>>(
  ({ className, ...props }, ref) => (
    <T.List ref={ref} data-component="tabs-list" className={cn("flex gap-4", className)} {...props} />
  ),
);
TabsList.displayName = "TabsList";

export const TabsTrigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof T.Trigger>>(
  ({ className, ...props }, ref) => (
    <T.Trigger ref={ref} data-component="tabs-trigger" className={cn(className)} {...props} />
  ),
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof T.Content>>(
  ({ className, ...props }, ref) => (
    <T.Content ref={ref} data-component="tabs-content" className={cn(className)} {...props} />
  ),
);
TabsContent.displayName = "TabsContent";
```

- [ ] **Step 3: Commit**

```bash
git add src/ds/components/Accordion.tsx src/ds/components/Tabs.tsx
git commit -m "feat(ds): Accordion (Disclosure) and Tabs (Radix wrappers)"
```

---

## Task 15: `Tag` / `Badge`, `Toast`, `SkipToContent`

**Files:**
- Create: `src/ds/components/Tag.tsx`
- Create: `src/ds/components/Toast.tsx`
- Create: `src/ds/components/SkipToContent.tsx`

- [ ] **Step 1: `Tag.tsx`**

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "info" | "success" | "warn" | "danger";
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ tone = "neutral", className, ...props }, ref) => (
    <span
      ref={ref}
      data-component="tag"
      data-tone={tone}
      className={cn("inline-flex items-center", className)}
      {...props}
    />
  ),
);
Tag.displayName = "Tag";
```

- [ ] **Step 2: `Toast.tsx` (Radix wrapper)**

```tsx
"use client";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as RT from "@radix-ui/react-toast";
import { cn } from "@/lib/cn";

export const ToastProvider = RT.Provider;
export const ToastViewport = forwardRef<HTMLOListElement, ComponentPropsWithoutRef<typeof RT.Viewport>>(
  ({ className, ...props }, ref) => (
    <RT.Viewport
      ref={ref}
      data-component="toast-viewport"
      className={cn("fixed bottom-4 end-4 z-50 flex flex-col gap-2", className)}
      {...props}
    />
  ),
);
ToastViewport.displayName = "ToastViewport";

export const Toast = forwardRef<HTMLLIElement, ComponentPropsWithoutRef<typeof RT.Root>>(
  ({ className, ...props }, ref) => (
    <RT.Root ref={ref} data-component="toast" className={cn(className)} {...props} />
  ),
);
Toast.displayName = "Toast";

export const ToastTitle = RT.Title;
export const ToastDescription = RT.Description;
export const ToastAction = RT.Action;
export const ToastClose = RT.Close;
```

- [ ] **Step 3: `SkipToContent.tsx`**

```tsx
import { cn } from "@/lib/cn";

interface SkipToContentProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SkipToContent({ href = "#main-content", children = "Skip to content", className }: SkipToContentProps) {
  return (
    <a
      href={href}
      data-component="skip-to-content"
      className={cn(
        "sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:start-2 focus-visible:top-2 focus-visible:z-50",
        className,
      )}
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/ds/components/Tag.tsx src/ds/components/Toast.tsx src/ds/components/SkipToContent.tsx
git commit -m "feat(ds): Tag, Toast, SkipToContent primitives"
```

---

## Task 16: `Tooltip` (Radix wrapper)

**Files:**
- Create: `src/ds/components/Tooltip.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as TP from "@radix-ui/react-tooltip";
import { cn } from "@/lib/cn";

export const TooltipProvider = TP.Provider;

interface TooltipProps {
  label: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export function Tooltip({ label, children, side = "top" }: TooltipProps) {
  return (
    <TP.Root>
      <TP.Trigger asChild>{children}</TP.Trigger>
      <TP.Portal>
        <TP.Content data-component="tooltip" side={side} sideOffset={4}>
          {label}
          <TP.Arrow aria-hidden="true" />
        </TP.Content>
      </TP.Portal>
    </TP.Root>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/ds/components/Tooltip.tsx
git commit -m "feat(ds): Tooltip primitive (Radix wrapper)"
```

---

## Task 17: Index file for design system

**Files:**
- Create: `src/ds/components/index.ts`

- [ ] **Step 1: Create the barrel**

```ts
export * from "./Button";
export * from "./IconButton";
export * from "./Link";
export * from "./Input";
export * from "./Textarea";
export * from "./Label";
export * from "./Field";
export * from "./Checkbox";
export * from "./RadioGroup";
export * from "./RadioCard";
export * from "./Select";
export * from "./Form";
export * from "./Stepper";
export * from "./Dialog";
export * from "./Lightbox";
export * from "./Accordion";
export * from "./Tabs";
export * from "./Tag";
export * from "./Toast";
export * from "./SkipToContent";
export * from "./Tooltip";
```

- [ ] **Step 2: Commit**

```bash
git add src/ds/components/index.ts
git commit -m "chore(ds): barrel export for design-system components"
```

---

## Task 18: `/dev/components` showcase route — every primitive in LTR + RTL

**Files:**
- Create: `src/app/(showcase)/dev/components/page.tsx`
- Create: `src/app/(showcase)/layout.tsx`

(Using a route group `(showcase)` keeps it outside the `[locale]` layout so it's accessible without locale routing — easier for dev work.)

- [ ] **Step 1: Create `src/app/(showcase)/layout.tsx`**

```tsx
import type { ReactNode } from "react";
import "../globals.css";

export const metadata = { title: "Steel Valley — Component showcase" };

export default function ShowcaseLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Create `src/app/(showcase)/dev/components/page.tsx`**

```tsx
"use client";
import { useState } from "react";
import {
  Button,
  IconButton,
  Link,
  Input,
  Textarea,
  Field,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  RadioCard,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Stepper,
  StepperStep,
  StepperProgress,
  useStepper,
  Dialog,
  DialogTrigger,
  DialogContent,
  Lightbox,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tag,
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
  Tooltip,
  TooltipProvider,
  SkipToContent,
} from "@/ds/components";

function Pane({ dir, children }: { dir: "ltr" | "rtl"; children: React.ReactNode }) {
  return (
    <section
      dir={dir}
      style={{
        border: "1px solid var(--color-steel)",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <h2 style={{ fontFamily: "var(--font-mono)" }}>{dir.toUpperCase()}</h2>
      {children}
    </section>
  );
}

function Showcase() {
  const [open, setOpen] = useState(false);
  const [lbOpen, setLbOpen] = useState(false);

  return (
    <>
      <h3>Buttons</h3>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
        <IconButton label="Like" icon={<span>♡</span>} />
      </div>

      <h3>Links</h3>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link href="/">Internal</Link>
        <Link href="https://example.com">External</Link>
      </div>

      <h3>Form fields</h3>
      <Field label="Email" required help="We don't spam.">
        {({ inputId, describedBy }) => (
          <Input id={inputId} aria-describedby={describedBy} type="email" />
        )}
      </Field>
      <Field label="Message">
        {({ inputId, describedBy }) => (
          <Textarea id={inputId} aria-describedby={describedBy} rows={3} />
        )}
      </Field>

      <h3>Checkbox + Radio</h3>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Checkbox /> Accept terms
      </label>
      <RadioGroup defaultValue="a">
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <RadioGroupItem value="a" /> Option A
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <RadioGroupItem value="b" /> Option B
        </label>
      </RadioGroup>

      <h3>RadioCard</h3>
      <RadioGroup defaultValue="restaurant" style={{ display: "grid", gap: "0.5rem" }}>
        <RadioCard value="restaurant" title="Restaurant fit-out" description="Cooking lines, prep tables, hoods." />
        <RadioCard value="hotel" title="Hotel kitchen" description="Banquet, room-service, staff dining." />
      </RadioGroup>

      <h3>Select</h3>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ss304">SS 304</SelectItem>
          <SelectItem value="ss316">SS 316</SelectItem>
        </SelectContent>
      </Select>

      <h3>Stepper</h3>
      <Stepper steps={3}>
        <StepperProgress />
        <StepperStep index={0}>Step one content</StepperStep>
        <StepperStep index={1}>Step two content</StepperStep>
        <StepperStep index={2}>Step three content</StepperStep>
        <StepperNav />
      </Stepper>

      <h3>Dialog</h3>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent title="Example dialog" description="With Escape to close + focus trap.">
          <p>Dialog body.</p>
        </DialogContent>
      </Dialog>

      <h3>Lightbox</h3>
      <Button onClick={() => setLbOpen(true)}>Open lightbox</Button>
      <Lightbox
        open={lbOpen}
        onOpenChange={setLbOpen}
        images={[
          { src: "/kitchens/kitchendemo.jpg", alt: "Kitchen one", caption: "Detail shot." },
          { src: "/kitchens/kitchendemo.jpg", alt: "Kitchen two" },
        ]}
      />

      <h3>Accordion</h3>
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>What materials?</AccordionTrigger>
          <AccordionContent>SS 304 / SS 316 primarily.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Lead time?</AccordionTrigger>
          <AccordionContent>2–6 weeks depending on scope.</AccordionContent>
        </AccordionItem>
      </Accordion>

      <h3>Tabs</h3>
      <Tabs defaultValue="storage">
        <TabsList>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="cooking">Cooking</TabsTrigger>
        </TabsList>
        <TabsContent value="storage">Storage content</TabsContent>
        <TabsContent value="cooking">Cooking content</TabsContent>
      </Tabs>

      <h3>Tags</h3>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Tag>neutral</Tag>
        <Tag tone="info">info</Tag>
        <Tag tone="success">success</Tag>
        <Tag tone="warn">warn</Tag>
        <Tag tone="danger">danger</Tag>
      </div>

      <h3>Tooltip</h3>
      <Tooltip label="Polished mirror finish">
        <span data-component="tooltip-target" style={{ textDecoration: "underline dotted" }}>
          #8 mirror
        </span>
      </Tooltip>

      <h3>Toast</h3>
      <Button onClick={() => setOpen(true)}>Show toast</Button>
      <Toast open={open} onOpenChange={setOpen} duration={3000}>
        <ToastTitle>Enquiry received</ToastTitle>
      </Toast>
    </>
  );
}

function StepperNav() {
  const { goPrev, goNext, current, total } = useStepper();
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Button variant="ghost" onClick={goPrev} disabled={current === 0}>
        Previous
      </Button>
      <Button onClick={goNext} disabled={current === total - 1}>
        Next
      </Button>
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <TooltipProvider>
      <ToastProvider>
        <SkipToContent />
        <main id="main-content" style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
          <h1>Component showcase</h1>
          <p style={{ fontFamily: "var(--font-mono)" }}>
            Every primitive in LTR + RTL. Tab through to verify focus rings.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Pane dir="ltr">
              <Showcase />
            </Pane>
            <Pane dir="rtl">
              <Showcase />
            </Pane>
          </div>
        </main>
        <ToastViewport />
      </ToastProvider>
    </TooltipProvider>
  );
}
```

- [ ] **Step 3: Verify the page renders**

Run: `npm run dev`. Visit `http://localhost:3000/dev/components`. Both panes render every primitive.

Tab through one of the panes — every interactive primitive shows the rust focus ring.

Toggle the OS-level "reduce motion" setting (System Preferences on macOS, Settings → Accessibility on Windows/Linux) and reload. Animations collapse.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(showcase\)
git commit -m "feat(ds): /dev/components showcase route — every primitive in LTR + RTL"
```

---

## Task 19: a11y test via axe-core + Playwright

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/a11y-showcase.spec.ts`
- Modify: `package.json` (add script)

- [ ] **Step 1: Install Playwright**

```bash
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: "http://localhost:3000",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
```

- [ ] **Step 3: Create `e2e/a11y-showcase.spec.ts`**

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Component showcase a11y", () => {
  test("no critical axe violations on /dev/components", async ({ page }) => {
    await page.goto("/dev/components");
    await page.waitForSelector("h1");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });

  test("/ has lang=ar dir=rtl and passes axe on root", async ({ page }) => {
    await page.goto("/");
    const html = await page.locator("html");
    await expect(html).toHaveAttribute("lang", "ar");
    await expect(html).toHaveAttribute("dir", "rtl");

    const results = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();
    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
});
```

- [ ] **Step 4: Add the script**

In `package.json` `"scripts"`:

```json
"test:e2e": "playwright test"
```

- [ ] **Step 5: Run**

Run: `npm run test:e2e`
Expected: tests pass. If a "critical" violation appears, fix the underlying primitive — don't relax the assertion.

If the test runner can't bind port 3000 because dev is already running, stop your manual dev server first.

- [ ] **Step 6: Commit**

```bash
git add playwright.config.ts e2e package.json package-lock.json
git commit -m "test(a11y): Playwright + axe checks for showcase and locale root

- Asserts zero critical violations on /dev/components
- Asserts <html lang=ar dir=rtl> on Arabic default route"
```

---

## Task 20: Update prep-status.md

**Files:**
- Modify: `docs/prep-status.md`

- [ ] **Step 1: Update Plan 3 row**

Replace the Plans table:

```markdown
| # | Plan | Status | Notes |
|---|------|--------|-------|
| 1 | Security & Scaffold | ✅ complete + pushed | Branch `redesign`, Next 15 + React 19, App Router alongside Pages Router |
| 2 | Backend Foundation (Payload + Supabase + i18n) | ✅ complete | 9 collections + 2 globals; /admin live; Arabic at /, English at /en |
| 3 | Design System + Primitives | ✅ complete (provisional tokens) | All 17 primitives RTL-safe; `/dev/components` route shows both directions; axe checks pass |
| 4 | Conversion + Discovery | ⏸ pending | Resend API key required |
| 5 | Performance Scaffolding | ⏸ pending | |
```

Add to "What runs locally today":
- `http://localhost:3000/dev/components` — primitive showcase, LTR + RTL
- `npm run test:e2e` — axe-core a11y assertions

Add to "What's waiting on Claude Design":
- Final token values (palette, spacing scale, type scale, motion curves, focus ring spec)
- The CAD-style spec block template
- Component-state mockups (default / hover / focus / active / disabled)

- [ ] **Step 2: Commit + push**

```bash
git add docs/prep-status.md
git commit -m "docs(prep-status): mark Plan 3 complete"
git push origin redesign
```

---

## Plan 3 — done.

**End-state achieved:**
- Tailwind v4 token layer in `globals.css` with stable variable names + provisional Refined Industrial values.
- `useReducedMotion` and `useMounted` hooks live.
- 17 primitive components built, all under `src/ds/components/`, all RTL-safe via logical CSS properties.
- Radix wrappers used wherever a11y is non-trivial (Dialog, Tabs, Accordion, Tooltip, Toast, Select, Checkbox, RadioGroup).
- Custom-built: Stepper (URL-hash sync, ARIA progressbar), Lightbox (keyboard + RTL-safe arrows), Field (ARIA-wired wrapper), Form (rhf + zod), SkipToContent, Tag.
- `/dev/components` showcase route renders everything in both LTR and RTL panes.
- Vitest unit tests for Button, Link, Field, Stepper.
- Playwright + axe e2e test asserts zero critical a11y violations on showcase and root locale page.
- `docs/prep-status.md` updated.

**When Claude Design delivers:** the deliverable will give us final values for `--color-*`, `--spacing-*`, `--duration-*`, `--ease-*`, focus ring spec, and per-component visual styles. The hand-off is a values-only edit in `globals.css` plus per-primitive style additions targeted at `data-component="..."` selectors. No structural rewrites required.

**Next:** Plan 4 — Conversion + Discovery (Quote Builder, lead magnet, WhatsApp, SEO, OpenPanel, migration script).
