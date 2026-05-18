import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { LeadMagnets } from "./payload/collections/LeadMagnets";
import { Categories } from "./payload/collections/Categories";
import { Products } from "./payload/collections/Products";
import { Services } from "./payload/collections/Services";
import { Authors } from "./payload/collections/Authors";
import { Posts } from "./payload/collections/Posts";
import { Pages } from "./payload/collections/Pages";
import { Enquiries } from "./payload/collections/Enquiries";
import { Leads } from "./payload/collections/Leads";
import { Settings } from "./payload/globals/Settings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
  },
  editor: lexicalEditor(),
  collections: [Users, Media, LeadMagnets, Categories, Products, Services, Authors, Posts, Pages, Enquiries, Leads],
  globals: [Settings],
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
