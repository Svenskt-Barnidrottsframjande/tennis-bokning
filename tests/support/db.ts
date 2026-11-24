import { Pool, type QueryResultRow } from "pg";

// Direct Postgres access for test setup, assertions and teardown. Talks to the local
// e2e database only (same guard as playwright.config.ts) — intentionally NOT the app's
// `src/db` handle, which is `server-only` and must stay out of the test process.
const url = process.env.DATABASE_URL ?? "";
if (!/@(127\.0\.0\.1|localhost)[:/]/.test(url)) {
  throw new Error("tests/support/db: DATABASE_URL must point at the local e2e database.");
}

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) pool = new Pool({ connectionString: url, max: 2 });
  return pool;
}

export async function query<Row extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<Row[]> {
  const result = await getPool().query<Row>(text, params);
  return result.rows;
}

export async function closeDb(): Promise<void> {
  await pool?.end();
  pool = null;
}
