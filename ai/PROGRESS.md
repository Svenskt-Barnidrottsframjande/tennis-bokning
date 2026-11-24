# Progress

Dashboard for "where are we". Rule for what lives here: **a thing stays as long as it
changes what a future session should do** — status, constraints, open issues. History
moves out: each finished plan's full writeup lives in its plan file under "As built"
(`ai/plans/N-*-plan.md`). Backlog lives in `ai/TODO.md`.

**Maintenance convention (when a plan finishes):** write the full "As built" writeup
(deviations, gotchas, spec names, migration status) at the end of the plan file →
paste it into the rolling window below and roll the oldest entry off (just delete it —
the plan file already has it) → add the plan's index line → fold any new standing
constraint or known issue into those sections.

## Status

**Scaffold — DONE (2026-11-24).** Next.js 16.4 (App Router, Turbopack, React Compiler,
Cache Components) + TypeScript + Tailwind v4 + Drizzle on `pg` against Neon + Playwright
against a local Docker Postgres. First migration `drizzle/0000_init.sql` creates the
starter `clubs` table. GitHub: `Svenskt-Barnidrottsframjande/tennis-bokning`.

**Not yet wired (needs account decisions — see TODO):** the Vercel project/team and the
Neon database itself. Until then `.env.local` has no `DATABASE_URL` and `/api/health`
answers 503; everything else (dev server, typecheck, lint, build, e2e) works.

## Standing constraints / gotchas
- **Cache Components is on.** A Server Component that reads the DB must sit under a
  `<Suspense>` boundary (or `use cache`), or `next build` fails. No `runtime`/`dynamic`
  segment configs.
- **`src/db/index.ts` is `server-only`.** Scripts and tests must not import it — they use
  `pg` directly (`tests/support/db.ts`, `scripts/reset-db.ts`).
- **drizzle-kit / tsx do not read `.env.local`.** Always go through the `npm run db:*`
  scripts (dotenv-cli) — never `npx drizzle-kit …` bare.
- **Migrations are applied by hand** (`npm run db:migrate`), never in the Vercel build.
  After a schema change: `db:generate` → read SQL → `db:migrate` → `db:reset:e2e`.
- **e2e refuses non-localhost `DATABASE_URL`** (playwright.config.ts + tests/support/db.ts).

## Known issues
- (none yet)

## Plan index
- (no plans yet — the first one defines the data model: clubs, courts, opening hours,
  bookings, members)
