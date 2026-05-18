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
