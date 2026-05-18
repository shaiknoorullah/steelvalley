import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let Payload, API, App Router internals, the existing dev health route,
  // the showcase route group and any static asset request pass through
  // without locale rewriting.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/app-router-health") ||
    pathname.startsWith("/dev/") ||
    pathname === "/dev" ||
    pathname.includes(".")
  ) {
    return;
  }

  return intlMiddleware(req);
}

export const config = {
  // Match everything except Payload, the API, Next internals, static assets,
  // the dev showcase route group, and the dev health-check route.
  matcher: [
    "/((?!admin|api|_next/static|_next/image|app-router-health|dev|favicon.ico).*)",
  ],
};
