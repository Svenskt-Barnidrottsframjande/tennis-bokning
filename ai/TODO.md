# TODO backlog

## Setup (2026-11-24 → 2026-11-26)
- [x] ~~**Vercel (new account).**~~ Done 2026-11-26: team `svenskt-barnidrottsfraemjande`
      (Svenskt Barnidrottsfrämjande, `team_OyXdb7EQxomd0tjJMvl7MxDI`), project `tennis-bokning`
      (`prj_7edoonFD4vLNUyoWEUzOTwpO0ZlD`), GitHub repo connected (push to `main` deploys
      production), `DATABASE_URL` + `DATABASE_URL_UNPOOLED` set for production / preview /
      development. Production variables are **sensitive** (team policy): write-only, cannot be
      pulled or read back — re-add them if they ever need to change.
- [x] ~~**Vercel function region → `fra1`.**~~ Done 2026-11-26 via the project setting
      (`serverlessFunctionRegion: fra1`, verified through the API); takes effect from the next deploy.
- [ ] **Deployment Protection bypass token.** `vercel curl` minted a project "automation
      bypass" token (Settings → Deployment Protection). Keep it only if an external checker needs
      to reach previews; otherwise delete it.
- [ ] **Preview deployments share the production Neon branch** for now. Later: a Neon branch
      per preview (Vercel preview env → `neon checkout`/branch-per-PR, see the `neon-postgres`
      skill) so previews never write production data.
- [x] ~~**Neon.**~~ Done 2026-11-26: project `frosty-violet-73169705` linked, `neon.ts` applied,
      env pulled, `0000_init` migrated to `production`; Neon skills + MCP via the user-level plugin.
- [ ] Decide **auth** before the first member-facing page. The `neon-auth` skill
      (`.claude/skills/neon-auth/`) covers Managed Better Auth; alternatives are Auth.js or
      app-owned e-mail codes like booking-system Plan 225.
- [x] ~~Repo visibility~~ — **public is intentional** (Bijan 2026-11-26: required for the free
      Vercel plan on this account). Consequence: every push publishes the code; never commit
      secrets (`.env*` is git-ignored apart from the two secret-free files).

## Open — features
- [ ] Plan 1: data model (clubs, courts, opening hours, bookings, members) + first migration
      after `clubs`.
- [ ] Plan 2: public booking page for one club (court × time grid).
