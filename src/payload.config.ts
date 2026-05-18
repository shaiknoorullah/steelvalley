import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { Users } from "./payload/collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
  },
  editor: lexicalEditor(),
  collections: [Users],
  globals: [
    // populated by Tasks 13-14
  ],
  localization: {
    locales: [
      { label: "العربية", code: "ar", rtl: true },
      { label: "English", code: "en" },
    ],
    defaultLocale: "ar",
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET ?? "placeholder-rotate-before-launch",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL ?? "" },
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media",
        },
        "lead-magnets": {
          prefix: "lead-magnets",
        },
      },
      bucket: "media",
      config: {
        endpoint: process.env.SUPABASE_S3_ENDPOINT ?? "",
        region: process.env.SUPABASE_S3_REGION ?? "",
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY ?? "",
        },
        forcePathStyle: true,
      },
    }),
  ],
});
