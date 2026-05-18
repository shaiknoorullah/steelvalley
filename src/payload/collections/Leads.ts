import type { CollectionConfig } from "payload";

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "source", "createdAt", "delivered"],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    { name: "email", type: "email", required: true, unique: true },
    {
      name: "source",
      type: "select",
      required: true,
      defaultValue: "lead-magnet-popup",
      options: [
        { label: "Lead magnet popup", value: "lead-magnet-popup" },
        { label: "Blog footer", value: "blog-footer" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "sourcePage",
      type: "text",
    },
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
      name: "delivered",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "True once the lead magnet PDF email has sent successfully." },
    },
    {
      name: "deliveredAt",
      type: "date",
    },
    {
      name: "unsubscribedAt",
      type: "date",
    },
  ],
};
