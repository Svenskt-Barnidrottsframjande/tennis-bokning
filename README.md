# tennis-bokning

Bokningssystem för tennisklubbar — **Next.js 16 + Neon (Lakebase Postgres, Drizzle) + Tailwind + Vercel**.
Sibling of `booking-system`, with Neon in place of Supabase.

## Run it

```bash
cp .env.local.example .env.local   # fill in DATABASE_URL (+ DATABASE_URL_UNPOOLED)
npm install
npm run db:migrate                 # apply drizzle/ migrations to the database in .env.local
npm run dev                        # http://localhost:3000  — /api/health shows the DB status
```

## Database (Neon + Drizzle)

| Command | What it does |
| --- | --- |
| `npm run db:generate` | diff `src/db/schema.ts` against `drizzle/` and write a new SQL migration |
| `npm run db:migrate` | apply pending migrations to `DATABASE_URL_UNPOOLED` (falls back to `DATABASE_URL`) |
| `npm run db:studio` | Drizzle Studio against the database in `.env.local` |

`src/db/schema.ts` is the schema. `drizzle/` holds generated migrations — commit them with the
schema change, apply them by hand (never in the Vercel build).

**Neon project:** `tennis-bokning` (`frosty-violet-73169705`, `aws-eu-central-1`, Postgres 18),
linked through the git-ignored `.neon` file. Everything goes through the Neon CLI:

```bash
npx neon@latest login          # once per machine (browser)
npx neon env pull              # refresh .env.local from the pinned branch
npx neon config plan           # dry-run neon.ts against the branch
npx neon deploy                # apply neon.ts + pull env
npx neon checkout dev-x --create   # work on a copy-on-write branch; .env.local follows
npx neon checkout production   # back to production
```

`neon.ts` declares the branch policy. Claude Code gets Neon's skills and MCP server from the
user-level plugin `neon-postgres@neon` (`npx neon plugins --agent claude-code`, once per machine).

## Tests (Playwright, local Postgres only)

```bash
npm run db:start:e2e     # docker compose: Postgres 17 on 127.0.0.1:54329 (Colima)
npm run db:reset:e2e     # drop → migrate → drizzle/seed.sql
npm test                 # full suite on its own dev server (:3100), env from .env.e2e
npm test -- tests/home.spec.ts
npm run db:stop:e2e      # tear down + wipe the volume
```

The suite refuses to run unless `DATABASE_URL` points at localhost, so it can never touch Neon.

## Deploy

Vercel, auto-deploy on push once the GitHub repo is connected (dashboard → Settings → Git).
With the Claude Code Vercel plugin: `/deploy`, `/env`, `/status`.

## Working with Claude Code

`AGENTS.md` (loaded via `CLAUDE.md`) holds the house style and workflow; `ai/` holds the
dashboard (`PROGRESS.md`), the route map (`SITEMAP.md`), the backlog (`TODO.md`) and numbered
plans. `.claude/hooks/` carries the e2e-nudge and main-behind-warning hooks.
