import { test, expect } from "./support/test";
import { query, closeDb } from "./support/db";

test.afterAll(async () => {
  await closeDb();
});

test("the app reaches the database", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toMatchObject({ ok: true, db: "up" });
});

test("migrations and seed are applied", async () => {
  const rows = await query<{ slug: string }>("select slug from clubs order by slug");
  expect(rows.map((r) => r.slug)).toContain("testklubben");
});
