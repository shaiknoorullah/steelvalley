import type { GlobalConfig } from "payload";

const linkFields = [
  { name: "label", type: "text" as const, required: true, localized: true },
  {
    name: "type",
    type: "select" as const,
    required: true,
    defaultValue: "internal",
    options: [
      { label: "Internal", value: "internal" },
      { label: "External", value: "external" },
    ],
  },
  { name: "href", type: "text" as const, required: true },
];

export const Nav: GlobalConfig = {
  slug: "nav",
  access: { read: () => true },
  fields: [
    {
      name: "header",
      type: "array",
      labels: { singular: "Header link", plural: "Header links" },
      fields: linkFields,
    },
    {
      name: "footer",
      type: "group",
      fields: [
        {
          name: "columns",
          type: "array",
          labels: { singular: "Footer column", plural: "Footer columns" },
          fields: [
            { name: "heading", type: "text", required: true, localized: true },
            {
              name: "links",
              type: "array",
              labels: { singular: "Link", plural: "Links" },
              fields: linkFields,
            },
          ],
        },
        {
          name: "legalLinks",
          type: "array",
          labels: { singular: "Legal link", plural: "Legal links" },
          fields: linkFields,
        },
      ],
    },
  ],
};
