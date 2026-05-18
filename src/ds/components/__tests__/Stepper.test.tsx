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
