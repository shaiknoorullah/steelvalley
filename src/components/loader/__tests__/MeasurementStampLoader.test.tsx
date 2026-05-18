import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MeasurementStampLoader } from "../MeasurementStampLoader";

describe("MeasurementStampLoader", () => {
  it("renders the Arabic anthem regardless of locale", () => {
    const en = render(
      <MeasurementStampLoader progress={0} ready={false} locale="en" />,
    );
    expect(en.getByText("حديد جدّة، يطعم المملكة.")).toBeInTheDocument();
    en.unmount();

    const ar = render(
      <MeasurementStampLoader progress={0} ready={false} locale="ar" />,
    );
    expect(ar.getByText("حديد جدّة، يطعم المملكة.")).toBeInTheDocument();
  });

  it("only renders the English caption when locale=en", () => {
    const en = render(
      <MeasurementStampLoader progress={0} ready={false} locale="en" />,
    );
    expect(
      en.getByText("stainless steel fabrication · jeddah · since 2005"),
    ).toBeInTheDocument();
    en.unmount();

    const ar = render(
      <MeasurementStampLoader progress={0} ready={false} locale="ar" />,
    );
    expect(
      ar.queryByText("stainless steel fabrication · jeddah · since 2005"),
    ).toBeNull();
  });

  it("ticks the mm counter with progress (0 → 1800)", () => {
    const { container, rerender } = render(
      <MeasurementStampLoader progress={0} ready={false} locale="ar" />,
    );
    expect(container.querySelector("text")?.textContent).toBe("0 MM");

    rerender(
      <MeasurementStampLoader progress={0.5} ready={false} locale="ar" />,
    );
    expect(container.querySelector("text")?.textContent).toBe("900 MM");

    rerender(
      <MeasurementStampLoader progress={1} ready={false} locale="ar" />,
    );
    expect(container.querySelector("text")?.textContent).toBe("1800 MM");
  });

  it("uses an aria-label that matches the active locale", () => {
    const en = render(
      <MeasurementStampLoader progress={0} ready={false} locale="en" />,
    );
    expect(en.getByLabelText("loading")).toBeInTheDocument();
    en.unmount();

    const ar = render(
      <MeasurementStampLoader progress={0} ready={false} locale="ar" />,
    );
    expect(ar.getByLabelText("جاري التحميل")).toBeInTheDocument();
  });
});
