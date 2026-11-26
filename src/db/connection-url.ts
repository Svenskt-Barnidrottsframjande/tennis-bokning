// Shared by src/db/index.ts and drizzle.config.ts — keep it free of `server-only` and app
// imports, because drizzle-kit bundles it on its own.

/**
 * Neon connection strings carry `sslmode=require`. pg 8 treats that as `verify-full` (full
 * certificate verification) but warns at startup that pg 9 will downgrade it to libpq's weaker
 * `require` semantics. Saying `verify-full` explicitly keeps today's verification on every pg
 * version and silences the warning. URLs without an sslmode (the local e2e Postgres) pass
 * through untouched.
 */
export function withStrictSsl(connectionString: string): string {
  return connectionString.replace(/([?&])sslmode=(?:require|prefer|verify-ca)(?=&|$)/, "$1sslmode=verify-full");
}
