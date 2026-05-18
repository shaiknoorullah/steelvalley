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
