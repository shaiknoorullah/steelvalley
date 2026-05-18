/**
 * Defensive `useLocale` shim.
 *
 * `next-intl` is being wired in a parallel worktree (feat-intl). Until that
 * lands, importing `next-intl` directly would break this worktree's build.
 *
 * Strategy: try to load `next-intl` lazily on the client (module cache means
 * the require is paid once). If it's missing or its `useLocale` throws
 * outside a NextIntlClientProvider, fall back to `"en"`. The hero
 * component tree never crashes because of locale wiring.
 *
 * TODO(integration): once feat-intl merges, swap callers to
 *     `import { useLocale } from "next-intl";`
 * and delete this file.
 */

type Locale = "ar" | "en";

let cached: { useLocale?: () => string } | null | undefined;

function loadNextIntl(): { useLocale?: () => string } | null {
  if (cached !== undefined) return cached;
  try {
    // The require itself is statically analyzable; it just resolves at
    // runtime to `null` if the module is missing. We use the runtime form
    // (no static import) so the bundler doesn't fail on a missing package.
    cached = require("next-intl");
  } catch {
    cached = null;
  }
  return cached;
}

export function useLocaleSafe(): Locale {
  const mod = loadNextIntl();
  if (mod && typeof mod.useLocale === "function") {
    try {
      const v = mod.useLocale();
      return v === "ar" ? "ar" : "en";
    } catch {
      return "en";
    }
  }
  return "en";
}
