import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder team portraits. Remove once real photos live in /public/team.
    remotePatterns: [{ protocol: "https", hostname: "i.pravatar.cc", pathname: "/**" }],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
