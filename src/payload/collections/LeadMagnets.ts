import type { CollectionConfig } from "payload";

export const LeadMagnets: CollectionConfig = {
  slug: "lead-magnets",
  admin: { useAsTitle: "title" },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  upload: {
    mimeTypes: ["application/pdf"],
  },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    {
      name: "locale",
      type: "select",
      required: true,
      options: [
        { label: "Arabic", value: "ar" },
        { label: "English", value: "en" },
      ],
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};
