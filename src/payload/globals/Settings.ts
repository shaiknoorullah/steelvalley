import type { GlobalConfig } from "payload";

export const Settings: GlobalConfig = {
  slug: "settings",
  access: { read: () => true },
  fields: [
    {
      name: "company",
      type: "group",
      fields: [
        { name: "name", type: "text", localized: true, required: true },
        { name: "tagline", type: "text", localized: true },
        { name: "logo", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "contact",
      type: "group",
      fields: [
        { name: "phone", type: "text", required: true },
        {
          name: "whatsappNumber",
          type: "text",
          admin: { description: "International format, e.g. +9665XXXXXXXX. Used by the WhatsApp floating CTA." },
        },
        { name: "email", type: "email", required: true },
        { name: "salesEmail", type: "email" },
      ],
    },
    {
      name: "address",
      type: "group",
      fields: [
        { name: "line1", type: "text", localized: true, required: true },
        { name: "line2", type: "text", localized: true },
        { name: "city", type: "text", localized: true, required: true, defaultValue: "Jeddah" },
        { name: "region", type: "text", localized: true, defaultValue: "Makkah" },
        { name: "country", type: "text", localized: true, required: true, defaultValue: "Saudi Arabia" },
        { name: "mapsUrl", type: "text" },
        { name: "latitude", type: "number" },
        { name: "longitude", type: "number" },
      ],
    },
    {
      name: "social",
      type: "array",
      labels: { singular: "Social link", plural: "Social links" },
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { label: "Instagram", value: "instagram" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "X (Twitter)", value: "x" },
            { label: "YouTube", value: "youtube" },
            { label: "TikTok", value: "tiktok" },
          ],
        },
        { name: "url", type: "text", required: true },
      ],
    },
  ],
};
