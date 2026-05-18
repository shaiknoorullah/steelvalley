import type { CollectionConfig } from "payload";

export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  admin: {
    useAsTitle: "reference",
    defaultColumns: ["reference", "name", "projectType", "createdAt", "status"],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true, // public submissions
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "reference",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "Auto-generated short reference, e.g. ENQ-2026-0001" },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Quoted", value: "quoted" },
        { label: "Won", value: "won" },
        { label: "Lost", value: "lost" },
      ],
    },
    {
      name: "projectType",
      type: "select",
      required: true,
      options: [
        { label: "Restaurant fit-out", value: "restaurant" },
        { label: "Hotel kitchen", value: "hotel" },
        { label: "Hospital", value: "hospital" },
        { label: "Decorative", value: "decorative" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "scope",
      type: "select",
      hasMany: true,
      options: [
        { label: "Hand Railing", value: "railing" },
        { label: "Column Cladding", value: "cladding" },
        { label: "Kitchen Equipment", value: "kitchen" },
        { label: "Decorative Items", value: "decorative" },
      ],
    },
    {
      name: "scopeNotes",
      type: "textarea",
    },
    {
      name: "dimensions",
      type: "text",
      admin: { description: "Free text — e.g. '12m railing × 3 floors'" },
    },
    {
      name: "budgetBand",
      type: "select",
      options: [
        { label: "< 50K SAR", value: "lt50k" },
        { label: "50K–150K SAR", value: "50to150k" },
        { label: "150K–500K SAR", value: "150to500k" },
        { label: "> 500K SAR", value: "gt500k" },
        { label: "Prefer not to say", value: "skip" },
      ],
    },
    {
      name: "timeline",
      type: "select",
      options: [
        { label: "Now", value: "now" },
        { label: "1–3 months", value: "1to3" },
        { label: "3–6 months", value: "3to6" },
        { label: "Planning", value: "planning" },
      ],
    },
    { name: "name", type: "text", required: true },
    { name: "company", type: "text" },
    {
      name: "phone",
      type: "text",
      required: true,
      admin: { description: "KSA format expected, e.g. +9665XXXXXXXX" },
    },
    { name: "email", type: "email", required: true },
    { name: "whatsappOptIn", type: "checkbox", defaultValue: false },
    {
      name: "sourceProduct",
      type: "relationship",
      relationTo: "products",
      admin: { description: "Populated when submitted from a product detail page." },
    },
    {
      name: "sourcePage",
      type: "text",
      admin: { description: "The page URL where the enquiry started." },
    },
    {
      name: "locale",
      type: "select",
      options: [
        { label: "Arabic", value: "ar" },
        { label: "English", value: "en" },
      ],
    },
    {
      name: "internalNotes",
      type: "textarea",
      admin: { description: "Internal — not visible to the customer." },
    },
  ],
};
