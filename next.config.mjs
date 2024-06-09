/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["aceternity.com"],
  },
  env: {
    AIRTABLE_BASE_ID: "appNpL3dO0aG3DBH9",
    AIRTABLE_API_KEY:
      "pat93G5laRF7hHoWS.99c68ac61f6f03b08b2244ce55de0fb1c49a373e211283aec1573f7420cc219e",
  },
};

export default nextConfig;
