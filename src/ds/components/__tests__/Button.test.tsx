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
