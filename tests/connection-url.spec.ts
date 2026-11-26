import { test, expect } from "./support/test";
import { withStrictSsl } from "../src/db/connection-url";

// Unit-level spec (no browser): the helper that getDb() and drizzle.config.ts run every Neon
// connection string through. The e2e database has no sslmode, so this is the only coverage.

test("rewrites Neon's sslmode=require to verify-full", () => {
  expect(withStrictSsl("postgresql://u:p@ep-x-pooler.neon.tech/db?sslmode=require")).toBe(
    "postgresql://u:p@ep-x-pooler.neon.tech/db?sslmode=verify-full",
  );
});

test("keeps the other query parameters, wherever sslmode sits", () => {
  expect(withStrictSsl("postgresql://u:p@h/db?channel_binding=require&sslmode=require")).toBe(
    "postgresql://u:p@h/db?channel_binding=require&sslmode=verify-full",
  );
  expect(withStrictSsl("postgresql://u:p@h/db?sslmode=prefer&application_name=app")).toBe(
    "postgresql://u:p@h/db?sslmode=verify-full&application_name=app",
  );
});

test("leaves local URLs and explicit modes untouched", () => {
  const local = "postgresql://postgres:postgres@127.0.0.1:54329/tennis";
  expect(withStrictSsl(local)).toBe(local);
  const strict = "postgresql://u:p@h/db?sslmode=verify-full";
  expect(withStrictSsl(strict)).toBe(strict);
  const off = "postgresql://u:p@h/db?sslmode=disable";
  expect(withStrictSsl(off)).toBe(off);
  // A password that merely contains the text must not be rewritten.
  const tricky = "postgresql://u:sslmode=require@h/db";
  expect(withStrictSsl(tricky)).toBe(tricky);
});
