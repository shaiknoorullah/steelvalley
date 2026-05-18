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
