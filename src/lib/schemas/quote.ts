import { z } from "zod";

export const ProjectType = z.enum([
  "restaurant",
  "hotel",
  "hospital",
  "decorative",
  "other",
]);
export const Scope = z.enum(["railing", "cladding", "kitchen", "decorative"]);
export const BudgetBand = z.enum([
  "lt50k",
  "50to150k",
  "150to500k",
  "gt500k",
  "skip",
]);
export const Timeline = z.enum(["now", "1to3", "3to6", "planning"]);

export const quoteSchema = z.object({
  projectType: ProjectType,
  scope: z.array(Scope).min(1, "Select at least one service."),
  scopeNotes: z.string().max(2000).optional(),
  dimensions: z.string().max(500).optional(),
  budgetBand: BudgetBand,
  timeline: Timeline,
  name: z.string().min(2, "Name is required."),
  company: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number."),
  email: z.string().email("Enter a valid email."),
  whatsappOptIn: z.boolean().default(false),
  sourceProductSlug: z.string().optional(),
  sourcePage: z.string().optional(),
  locale: z.enum(["ar", "en"]),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

// Per-step subschemas (Stepper uses these to validate one step at a time)
export const stepSchemas = {
  type: quoteSchema.pick({ projectType: true }),
  scope: quoteSchema.pick({ scope: true, scopeNotes: true }),
  dimensions: quoteSchema.pick({ dimensions: true }),
  budget: quoteSchema.pick({ budgetBand: true }),
  timeline: quoteSchema.pick({ timeline: true }),
  contact: quoteSchema.pick({
    name: true,
    company: true,
    phone: true,
    email: true,
    whatsappOptIn: true,
  }),
};
