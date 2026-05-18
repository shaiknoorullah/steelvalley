"use client";
import { useFormContext } from "react-hook-form";
import type { QuoteInput } from "@/lib/schemas/quote";
import {
  Field,
  Input,
  Textarea,
  RadioGroup,
  RadioCard,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Checkbox,
} from "@/ds/components";

export function StepType() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuoteInput>();
  const value = watch("projectType");
  return (
    <fieldset className="sv-quote-fieldset">
      <legend className="sv-quote-legend">
        <span className="sv-quote-step-num">step 01</span>
        <span className="sv-quote-step-title">Project type</span>
      </legend>
      <p className="sv-quote-step-help">
        Pick the closest fit — you can describe nuance later.
      </p>
      <RadioGroup
        value={value}
        onValueChange={(v: string) =>
          setValue("projectType", v as QuoteInput["projectType"], {
            shouldValidate: true,
          })
        }
        className="sv-quote-radio-grid"
      >
        <RadioCard
          value="restaurant"
          title="Restaurant fit-out"
          description="Cooking lines, prep tables, hoods, workstations."
        />
        <RadioCard
          value="hotel"
          title="Hotel kitchen"
          description="Banquet, room-service, staff dining."
        />
        <RadioCard
          value="hospital"
          title="Hospital"
          description="Sterile, medical-grade fabrication."
        />
        <RadioCard
          value="decorative"
          title="Decorative"
          description="Cladding, railings, feature pieces."
        />
        <RadioCard
          value="other"
          title="Other"
          description="Describe in the next step."
        />
      </RadioGroup>
      {errors.projectType ? (
        <small role="alert" className="sv-quote-error">
          {errors.projectType.message}
        </small>
      ) : null}
    </fieldset>
  );
}

export function StepScope() {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<QuoteInput>();
  const scope = (watch("scope") ?? []) as QuoteInput["scope"];
  const toggle = (v: QuoteInput["scope"][number]) => {
    const next = scope.includes(v)
      ? scope.filter((s) => s !== v)
      : [...scope, v];
    setValue("scope", next, { shouldValidate: true });
  };
  const options: { value: QuoteInput["scope"][number]; label: string }[] = [
    { value: "railing", label: "Hand railing" },
    { value: "cladding", label: "Column cladding" },
    { value: "kitchen", label: "Kitchen equipment" },
    { value: "decorative", label: "Decorative items" },
  ];
  return (
    <fieldset className="sv-quote-fieldset">
      <legend className="sv-quote-legend">
        <span className="sv-quote-step-num">step 02</span>
        <span className="sv-quote-step-title">Scope</span>
      </legend>
      <p className="sv-quote-step-help">Tick everything you need.</p>
      <div className="sv-quote-checkbox-grid">
        {options.map((o) => {
          const checked = scope.includes(o.value);
          return (
            <label
              key={o.value}
              className="sv-quote-checkbox-row"
              data-checked={checked || undefined}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => toggle(o.value)}
              />
              <span>{o.label}</span>
            </label>
          );
        })}
      </div>
      {errors.scope ? (
        <small role="alert" className="sv-quote-error">
          {errors.scope.message as string}
        </small>
      ) : null}
      <div className="sv-quote-field-block">
        <Field label="Notes (optional)">
          {({ inputId, describedBy }) => (
            <Textarea
              id={inputId}
              aria-describedby={describedBy}
              rows={4}
              {...register("scopeNotes")}
            />
          )}
        </Field>
      </div>
    </fieldset>
  );
}

export function StepDimensions() {
  const { register } = useFormContext<QuoteInput>();
  return (
    <fieldset className="sv-quote-fieldset">
      <legend className="sv-quote-legend">
        <span className="sv-quote-step-num">step 03</span>
        <span className="sv-quote-step-title">Dimensions</span>
      </legend>
      <p className="sv-quote-step-help">Rough figures help us estimate scale.</p>
      <Field
        label="Dimensions / quantity (optional)"
        help="e.g. 12 m railing across 3 floors; 4 cooking stations."
      >
        {({ inputId, describedBy }) => (
          <Input
            id={inputId}
            aria-describedby={describedBy}
            {...register("dimensions")}
          />
        )}
      </Field>
    </fieldset>
  );
}

export function StepBudget() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuoteInput>();
  const value = watch("budgetBand");
  return (
    <fieldset className="sv-quote-fieldset">
      <legend className="sv-quote-legend">
        <span className="sv-quote-step-num">step 04</span>
        <span className="sv-quote-step-title">Budget</span>
      </legend>
      <p className="sv-quote-step-help">
        Helps us match the right materials and timeline.
      </p>
      <Field label="Budget band">
        {() => (
          <Select
            value={value}
            onValueChange={(v: string) =>
              setValue("budgetBand", v as QuoteInput["budgetBand"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="sv-quote-select-trigger">
              <SelectValue placeholder="Choose…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lt50k">Less than 50K SAR</SelectItem>
              <SelectItem value="50to150k">50K – 150K SAR</SelectItem>
              <SelectItem value="150to500k">150K – 500K SAR</SelectItem>
              <SelectItem value="gt500k">More than 500K SAR</SelectItem>
              <SelectItem value="skip">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        )}
      </Field>
      {errors.budgetBand ? (
        <small role="alert" className="sv-quote-error">
          {errors.budgetBand.message}
        </small>
      ) : null}
    </fieldset>
  );
}

export function StepTimeline() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuoteInput>();
  const value = watch("timeline");
  return (
    <fieldset className="sv-quote-fieldset">
      <legend className="sv-quote-legend">
        <span className="sv-quote-step-num">step 05</span>
        <span className="sv-quote-step-title">Timeline</span>
      </legend>
      <p className="sv-quote-step-help">When would you want this delivered?</p>
      <RadioGroup
        value={value}
        onValueChange={(v: string) =>
          setValue("timeline", v as QuoteInput["timeline"], {
            shouldValidate: true,
          })
        }
        className="sv-quote-radio-grid"
      >
        <RadioCard value="now" title="Now" />
        <RadioCard value="1to3" title="1–3 months" />
        <RadioCard value="3to6" title="3–6 months" />
        <RadioCard value="planning" title="Still planning" />
      </RadioGroup>
      {errors.timeline ? (
        <small role="alert" className="sv-quote-error">
          {errors.timeline.message}
        </small>
      ) : null}
    </fieldset>
  );
}

export function StepContact() {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuoteInput>();
  return (
    <fieldset className="sv-quote-fieldset">
      <legend className="sv-quote-legend">
        <span className="sv-quote-step-num">step 06</span>
        <span className="sv-quote-step-title">Contact</span>
      </legend>
      <p className="sv-quote-step-help">
        We&apos;ll send the quote to your email and may follow up by phone.
      </p>
      <div className="sv-quote-field-stack">
        <Field label="Name" required error={errors.name?.message}>
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              aria-describedby={describedBy}
              {...register("name")}
            />
          )}
        </Field>
        <Field label="Company">
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              aria-describedby={describedBy}
              {...register("company")}
            />
          )}
        </Field>
        <Field label="Phone" required error={errors.phone?.message}>
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              aria-describedby={describedBy}
              type="tel"
              inputMode="tel"
              {...register("phone")}
            />
          )}
        </Field>
        <Field label="Email" required error={errors.email?.message}>
          {({ inputId, describedBy }) => (
            <Input
              id={inputId}
              aria-describedby={describedBy}
              type="email"
              inputMode="email"
              {...register("email")}
            />
          )}
        </Field>
        <label className="sv-quote-checkbox-row sv-quote-checkbox-row--inline">
          <input
            type="checkbox"
            {...register("whatsappOptIn")}
            className="sv-quote-native-checkbox"
          />
          <span>Contact me via WhatsApp</span>
        </label>
      </div>
    </fieldset>
  );
}
