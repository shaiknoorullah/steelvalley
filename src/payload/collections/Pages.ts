import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: { useAsTitle: "title" },
  access: { read: () => true },
  fields: [
    {
      name: "key",
      type: "select",
      required: true,
      unique: true,
      options: [
        { label: "Home", value: "home" },
        { label: "About", value: "about" },
        { label: "Services", value: "services" },
        { label: "Products", value: "products" },
        { label: "Contact", value: "contact" },
        { label: "Blog index", value: "blog" },
        { label: "Privacy", value: "privacy" },
        { label: "Terms", value: "terms" },
      ],
    },
    { name: "title", type: "text", required: true, localized: true },
    { name: "heroHeadline", type: "text", localized: true },
    { name: "heroSubline", type: "textarea", localized: true },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
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
