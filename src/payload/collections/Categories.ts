import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: { useAsTitle: "name" },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true, localized: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "URL-safe identifier, e.g. 'storage', 'cooking'." },
    },
    { name: "description", type: "textarea", localized: true },
    {
      name: "icon",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "order",
      type: "number",
      admin: { description: "Display order on the products page." },
    },
  ],
};
