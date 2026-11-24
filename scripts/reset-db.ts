// Reset the LOCAL e2e database: drop everything, replay drizzle/ migrations, apply
// drizzle/seed.sql. Run as `npm run db:reset:e2e` (dotenv-cli loads .env.e2e first).
// (No top-level await: tsx compiles .ts under this package as CommonJS.)
import { readFile } from "node:fs/promises";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const url = process.env.DATABASE_URL ?? "";
if (!/@(127\.0\.0\.1|localhost)[:/]/.test(url)) {
  console.error("reset-db: refusing — DATABASE_URL must point at the local e2e database.");
  process.exit(1);
}

async function main() {
  const pool = new Pool({ connectionString: url, max: 1 });
  try {
    await pool.query("drop schema if exists public cascade");
    await pool.query("drop schema if exists drizzle cascade");
    await pool.query("create schema public");
    await migrate(drizzle(pool), { migrationsFolder: "./drizzle" });
    const seed = await readFile("./drizzle/seed.sql", "utf8").catch(() => "");
    if (seed.trim()) await pool.query(seed);
    console.log("reset-db: migrations + seed applied to", url.replace(/:\/\/.*@/, "://***@"));
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("reset-db failed:", error);
  process.exit(1);
});
