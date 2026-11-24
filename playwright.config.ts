import { defineConfig, devices } from "@playwright/test";

// The suite ALWAYS runs against the throwaway local Postgres (scripts/e2e-db.mjs) +
// a dedicated dev server on port 3100 (never the Neon-pointed `npm run dev` on 3000).
// Env is injected by `dotenv -e .env.e2e` (see the `test` script); the dev server inherits it.
//
// Safety net: refuse to run unless DATABASE_URL points at localhost, so a stray env
// can never aim write-heavy specs at Neon.
const DATABASE_URL = process.env.DATABASE_URL ?? "";
if (!/@(127\.0\.0\.1|localhost)[:/]/.test(DATABASE_URL)) {
  throw new Error(
    `Refusing to run e2e: DATABASE_URL is "${DATABASE_URL.replace(/:\/\/.*@/, "://***@")}", not a local database. ` +
      `Run via \`npm test\` (loads .env.e2e) with \`npm run db:start:e2e\` up.`,
  );
}

const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  // Serial: specs share one local DB and mutate it; correctness over speed while the
  // suite is small. Revisit (shards, one DB per worker) when it grows.
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `next dev -p ${PORT}`,
    url: BASE_URL,
    // Never reuse an existing server — it could be the Neon-pointed dev server.
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
