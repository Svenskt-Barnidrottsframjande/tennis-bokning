import "server-only";
import { Pool } from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { withStrictSsl } from "./connection-url";

// The one database handle for the app. Server-only: importing this from a Client
// Component is a build error (`server-only`), so `pg` never ships to the browser.
//
// Driver choice: node-postgres (`pg`) rather than Neon's HTTP driver, so the very same
// code runs against Neon in prod/dev (pooled `-pooler` endpoint, pgbouncer) AND against
// the plain local Postgres the e2e suite uses (docker-compose.e2e.yml). Fluid Compute
// keeps the function instance warm, so a small module-level pool is the right shape.
//
// Lazy: `next build` evaluates module scope, and on a first deploy DATABASE_URL may not
// exist yet — so nothing connects until the first query. Plain function, not a Proxy
// (Proxies around the db break libraries that introspect the adapter object).
export type Db = NodePgDatabase<typeof schema>;

let db: Db | null = null;

export function getDb(): Db {
  if (db) return db;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — copy .env.local.example to .env.local (see README).");
  }
  const pool = new Pool({ connectionString: withStrictSsl(connectionString), max: 5 });
  db = drizzle(pool, { schema });
  return db;
}

export { schema };
