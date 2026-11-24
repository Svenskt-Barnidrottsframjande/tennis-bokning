import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";

// Liveness + database round-trip. Use it to confirm a fresh Neon wiring after
// `vercel env pull` / a deploy: 200 `{ ok: true }` means the app reached Postgres.
// Route handlers are dynamic under Cache Components; no segment config needed.

export async function GET() {
  try {
    const result = await getDb().execute<{ ok: number }>(sql`select 1 as ok`);
    const ok = result.rows[0]?.ok === 1;
    return NextResponse.json({ ok, db: ok ? "up" : "unexpected" }, { status: ok ? 200 : 503 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, db: "down", error: message }, { status: 503 });
  }
}
