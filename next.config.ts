import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components (+ Partial Prefetching) are the create-next-app defaults for Next 16.4
  // and become mandatory in the next major. Data access is dynamic by default: a page that
  // reads the DB renders inside a <Suspense> boundary (or opts into `use cache`). This is the
  // one framework-level difference from booking-system (which predates the flag).
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  // The e2e dev server (.env.e2e sets NEXT_DIST_DIR=.next-e2e) builds into its own dir:
  // Next 16's dev lock lives at <distDir>/dev/lock, so a distinct distDir lets the isolated
  // e2e server run alongside a normal `next dev` on .next.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
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
