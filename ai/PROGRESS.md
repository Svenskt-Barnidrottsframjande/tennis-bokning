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

**Neon — WIRED (2026-11-26).** Project `tennis-bokning` (`frosty-violet-73169705`,
`aws-eu-central-1`, Postgres 18) linked via `.neon`; `neon.ts` applied (`neon deploy`, no
changes); `.env.local` pulled (5 vars); `0000_init` migrated to the `production` branch.
Neon skills + MCP server come from the user-level Claude Code plugin `neon-postgres@neon`
(installed 2026-11-26, auto-updates; first used project-scope, moved global the same day).

**Vercel — WIRED (2026-11-26).** New account/team `svenskt-barnidrottsfraemjande`
(Svenskt Barnidrottsfrämjande), project `tennis-bokning` (`prj_7edoonFD4vLNUyoWEUzOTwpO0ZlD`),
GitHub repo connected → every push to `main` deploys production; `DATABASE_URL` +
`DATABASE_URL_UNPOOLED` on production (sensitive, write-only) / preview / development.
First deployment (CLI, 2026-11-26) is live at **https://tennis-bokning.vercel.app** —
`/api/health` → `{"ok":true,"db":"up"}` from Vercel to Neon. Function region set to **`fra1`**
(Frankfurt, same as Neon) on 2026-11-26; the first deploy ran in `iad1`, later ones use `fra1`. Deployment Protection (Vercel
Authentication) covers every non-custom-domain URL except the bare `tennis-bokning.vercel.app`
alias; a project "automation bypass" token exists (created by `vercel curl`). The
Vercel plugin's MCP in a Claude session may still be signed in as the old account — the
CLI (`vercel whoami` → `info-88565091`) is the source of truth for this project.

## Standing constraints / gotchas
- **The repo is PUBLIC** (deliberate — free Vercel plan). Nothing secret may be committed.
  `.env.e2e` and `.env.local.example` are the only committed env files, by design secret-free.
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
- **`.env.local` is owned by the Neon CLI.** `neon deploy` / `neon env pull` / `neon checkout`
  rewrite it; never hand-edit the `DATABASE_URL*` lines. Hand-added keys survive a pull.
- **Vercel production env vars are sensitive (write-only).** `vercel env pull` returns them
  empty by design; only a deployment can prove them. Change = `env rm` + `env add`.
- **Neon skills live in the user-level plugin**, not the repo — a new machine needs
  `npx neon plugins --agent claude-code` once.

## Known issues
- (none yet)

## Plan index
- (no plans yet — the first one defines the data model: clubs, courts, opening hours,
  bookings, members)
