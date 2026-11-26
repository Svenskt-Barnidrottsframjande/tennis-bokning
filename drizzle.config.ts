import { defineConfig } from "drizzle-kit";
import { withStrictSsl } from "./src/db/connection-url";

// drizzle-kit does NOT load .env.local itself — the db:* scripts wrap it in dotenv-cli.
// Migrations go to the direct (unpooled) endpoint when there is one: pgbouncer in
// transaction mode is fine for app queries but not for everything a migration does.
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: url ? withStrictSsl(url) : "" },
  strict: true,
  verbose: true,
});
