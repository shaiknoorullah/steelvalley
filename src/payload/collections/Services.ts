import type { CollectionConfig } from "payload";

export const Services: CollectionConfig = {
  slug: "services",
  admin: { useAsTitle: "name" },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true, localized: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "tagline", type: "text", localized: true },
    { name: "description", type: "richText", localized: true },
    { name: "hero", type: "upload", relationTo: "media" },
    {
      name: "benefits",
      type: "array",
      labels: { singular: "Benefit", plural: "Benefits" },
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "body", type: "textarea", localized: true },
      ],
    },
    {
      name: "useCases",
      type: "array",
      labels: { singular: "Use case", plural: "Use cases" },
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "body", type: "textarea", localized: true },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "commonProducts",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "order",
      type: "number",
      admin: { description: "Display order on the services page." },
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "description", type: "textarea", localized: true },
        { name: "ogImage", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
