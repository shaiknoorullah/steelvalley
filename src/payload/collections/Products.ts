import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: { useAsTitle: "name", defaultColumns: ["name", "category", "updatedAt"] },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true, localized: true },
    { name: "slug", type: "text", required: true, unique: true },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
    { name: "shortDescription", type: "textarea", localized: true },
    {
      name: "description",
      type: "richText",
      localized: true,
    },
    {
      name: "spec",
      type: "group",
      label: "CAD-style spec block (renders programmatically)",
      fields: [
        {
          type: "row",
          fields: [
            { name: "widthMm", type: "number", admin: { width: "33%" } },
            { name: "heightMm", type: "number", admin: { width: "33%" } },
            { name: "depthMm", type: "number", admin: { width: "33%" } },
          ],
        },
        {
          name: "material",
          type: "select",
          options: [
            { label: "SS 304", value: "ss304" },
            { label: "SS 316", value: "ss316" },
            { label: "SS 430", value: "ss430" },
            { label: "Mild Steel", value: "mild" },
            { label: "Aluminium", value: "aluminium" },
          ],
        },
        {
          name: "gaugeMm",
          type: "number",
          admin: { description: "Sheet thickness in mm (e.g. 1.2)" },
        },
        {
          name: "finish",
          type: "select",
          options: [
            { label: "#4 Brushed", value: "brushed-4" },
            { label: "#8 Mirror", value: "mirror-8" },
            { label: "Bead Blasted", value: "bead-blasted" },
            { label: "Powder Coated", value: "powder-coat" },
          ],
        },
      ],
    },
    {
      name: "gallery",
      type: "array",
      minRows: 1,
      labels: { singular: "Photo", plural: "Photos" },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        {
          name: "view",
          type: "select",
          options: [
            { label: "Front", value: "front" },
            { label: "Three-quarter", value: "three-quarter" },
            { label: "Detail", value: "detail" },
            { label: "Installed", value: "installed" },
          ],
        },
      ],
    },
    {
      name: "installations",
      type: "array",
      labels: { singular: "Installation photo", plural: "Installation photos" },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "caption", type: "text", localized: true },
        { name: "venue", type: "text", localized: true, admin: { description: "e.g. 'Hilton Jeddah Banquet Kitchen'" } },
      ],
    },
    {
      name: "model3d",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional GLB model — viewer renders only when present." },
    },
    {
      name: "relatedProducts",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      maxDepth: 1,
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
