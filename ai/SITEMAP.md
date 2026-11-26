# Sitemap — routes and structure

> Keep this in sync as you add routes. It exists so an agent can locate code without
> searching blind.

## Routes (URL → file)
| URL | File | Notes |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | placeholder landing (Swedish); no data yet |
| `/api/health` | `src/app/api/health/route.ts` | `select 1` through `getDb()` → `{ ok, db }`; 503 when Neon is unreachable |

## src/ tree
```
src/
  app/
    layout.tsx            root layout (lang="sv", Geist fonts, metadata)
    page.tsx              home
    globals.css           Tailwind v4 + design tokens (--brand, --background, …)
    api/health/route.ts   DB round-trip
  db/
    index.ts              getDb() — lazy Drizzle handle on a pg Pool (server-only)
    schema.ts             Drizzle tables — THE current schema
  components/             (empty — shared UI goes here)
  lib/                    (empty — domain logic / server actions go here)
drizzle/
  0000_init.sql           first migration (clubs)
  meta/                   drizzle-kit journal + snapshots (generated, committed)
  seed.sql                e2e fixtures (applied by scripts/reset-db.ts)
tests/
  support/test.ts         the one import point for test/expect (fixtures grow here)
  support/db.ts           direct SQL against the local e2e database
  home.spec.ts            landing renders, lang=sv
  health.spec.ts          /api/health 200 + seed present
neon.ts                   Neon branch policy (infrastructure as code) — `neon config plan` / `neon deploy`
.neon                     (git-ignored) link: org + project + pinned branch
.claude/
  settings.json           hooks (e2e-nudge, main-behind-warning, remote-session-warning)
  hooks/                  the hook scripts
  (Neon skills + MCP come from the user-level plugin `neon-postgres@neon`, not the repo)
scripts/
  reset-db.ts             drop → migrate → seed the local e2e database
```
