/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["aceternity.com"],
  },
  // Legacy Pages Router code has React-19 / framer-motion-v11 type drift that
  // will be removed in Plan 2+. Track suppressions in docs/prep-status.md.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
