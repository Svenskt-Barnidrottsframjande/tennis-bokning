<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Context

**tennis-bokning** — a booking page for tennis clubs (courts, times, members), built for
Svenskt Barnidrottsfrämjande. Sibling of `booking-system` (same house style, same workflow);
the deliberate differences are **Neon Postgres + Drizzle instead of Supabase** and
**Cache Components on** (see Stack). What follows is the shared house style.

## Start here — the `ai/` folder
Read these BEFORE exploring the codebase:
- `ai/SITEMAP.md` — every route (URL → file) and the `src/` tree. Consult it first to locate code instead of searching blind.
- `ai/PROGRESS.md` — the dashboard: status + rolling window of the last ~3 plans,
  standing constraints/gotchas, known issues, deferred carve-outs, and a one-line-per-plan
  index. Content rule: **something stays in PROGRESS only while it changes what a future
  session should do**; once it merely explains the past it moves to the plan file (see below).
- `ai/TODO.md` — task backlog.
- `ai/plans/` — numbered feature plans; new plans go here as `N-name-plan.md`. Each finished
  plan's full writeup (deviations, gotchas, migration status, spec names) lives at the end of
  its plan file under **"As built"** — write it there when the plan completes, then follow the
  maintenance convention at the top of `ai/PROGRESS.md`.
- `src/db/schema.ts` — **the CURRENT schema**, as Drizzle table definitions. Read THIS to learn
  what a table looks like today — never an individual migration under `drizzle/`, which only
  shows one step of the chain.

## Stack
- Next.js 16 (App Router, Turbopack, React Compiler) + TypeScript
- **Cache Components + Partial Prefetching are ON** (`next.config.ts`). Data access is
  dynamic by default: a page or component that reads the DB, `cookies()` or `headers()` must
  render inside a `<Suspense>` boundary (or opt into `use cache`), otherwise `next build`
  fails. Read `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` before
  the first data-reading page. No `runtime` / `dynamic` route segment configs.
- **Neon Postgres** via **Drizzle ORM** on the `pg` driver — `src/db/`:
  - `src/db/index.ts` → `getDb()` (lazy, server-only, one small pool). Import it in Server
    Components, Server Actions and route handlers only. Never a `Proxy` around it.
  - `src/db/schema.ts` → tables (source of truth). `drizzle/` → generated SQL migrations.
  - Workflow: edit schema → `npm run db:generate` → read the SQL → `npm run db:migrate`
    (against `DATABASE_URL_UNPOOLED` when set). Migrations are applied by hand, never in the
    Vercel build. Commit the migration with the schema change.
  - The app uses the **pooled** Neon endpoint (`DATABASE_URL`); Neon branches are the
    dev/preview-isolation tool (one branch per environment or per PR).
- Tailwind CSS v4 (via `@tailwindcss/turbopack`, no PostCSS config). Design tokens in
  `src/app/globals.css` (`--brand`, `--background`, …).
- Vercel hosting (Fluid Compute, Node runtime).
- Validation: `zod`. Server-only modules import `server-only` at the top.

## Deployment tooling
The **Vercel plugin** for Claude Code is installed (user scope). Prefer its `/deploy` and `/env`
slash commands and the Vercel MCP (list projects/deployments, inspect logs) over hand-rolled
`vercel` CLI sequences. Neon is provisioned through the **Vercel Marketplace** integration
(`vercel integration add neon`) so `DATABASE_URL` / `DATABASE_URL_UNPOOLED` land in the project
env automatically; `vercel env pull .env.local` brings them down locally. Note: connecting a
fresh repo to Vercel for auto-deploy is still a one-time grant in the dashboard (Settings → Git).

## Language
- UI labels: Swedish
- Code, database, file names: English

## Workflow
Feature work is plan-then-execute, one step at a time:
1. Write a plan first: explore the code, ask about genuine decisions, and structure the work as
   numbered steps where each step is independently buildable and testable (with a "how to test"
   per step). Save it in `ai/plans/` as `N-name-plan.md`. **Each step's "how to test" must name
   the e2e spec it adds or updates** (see Testing below).
2. Execute ONE step at a time: implement, verify (`npm run typecheck` + running dev server + DB
   checks + the specs that cover the step — **never the full suite per step**), report what was
   verified, then ask before continuing.
3. Clean up throwaway test data after verifying — a dev session may point at a shared Neon branch.
4. Commit and push only when explicitly asked.
5. Keep `ai/PROGRESS.md` current after each meaningful chunk of work: the full writeup goes in
   the plan file ("As built"), PROGRESS gets the rolling-window copy, index line, and any new
   standing constraint / known issue.

## Parallel worktree agents
Worktrees (`.claude/worktrees/*`) branch from **`origin/main`**, not local HEAD:
- **Before spawning:** commit and push the plan files the agents need. Never leave a plan as an
  untracked draft in the main checkout — once the worktree commits it, that draft blocks the main
  checkout's `git pull`.
- **In the worktree:** copy in `.env.local` (gitignored) before running anything that needs Neon.
  All checkouts share the single local e2e database, so only one suite runs at a time.
- **When the work is on `origin/main`, finish all of these** (whoever does it): fast-forward the
  main checkout (`git pull --ff-only`, `npm install` if `package.json` changed), then remove the
  worktree once `git status` is clean and `git log origin/main..<branch>` is empty.
- A committed **SessionStart hook** (`.claude/hooks/main-behind-warning`) warns when local `main`
  is behind `origin/main`. If it fires, pull before doing anything else.

## Testing (e2e) — keep it current
The Playwright suite in `tests/` runs against a **throwaway local Postgres**
(`scripts/e2e-db.mjs`, port 54329) and a dedicated dev server on :3100 — never Neon
(config: `playwright.config.ts`, env: `.env.e2e`; the config refuses a non-localhost
`DATABASE_URL`). Docker runs in Colima.
- `npm run db:start:e2e` once per machine session; `npm run db:reset:e2e` replays `drizzle/`
  migrations + `drizzle/seed.sql` (run it after any schema change, and before a full run).
- `npm test -- tests/<spec>` — targeted specs; `npm test` — the full suite.
Shared helpers live in `tests/support/` (`test.ts` is the one place specs import `test`/`expect`
from — an ESLint rule enforces it; `db.ts` is direct SQL for setup/assertions). Fixtures are
keyed by stable natural keys (`slug`), never hardcoded UUIDs.

**The rule:** a step that changes user-visible or data behavior is **not done until an e2e spec
covers it** — add or update a spec under `tests/` (new fixtures in `drizzle/seed.sql`) and get
those specs green. **The full suite runs once per plan, at the end** — never per step. If a change
genuinely has no e2e-able surface (pure refactor, types, comments, config), say so explicitly
instead of skipping silently. A committed **Stop hook** (`.claude/settings.json` →
`.claude/hooks/e2e-nudge`) reminds you when a session touched `src/**` but no `tests/**`.

## Modularity
- Extract shared UI into reusable components — never copy-paste.
- Before building something new, check if a component already exists.
- Page-level files stay thin; logic and UI blocks live in dedicated components
  (`src/components/`) and `src/lib/`.
