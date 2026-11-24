# TODO backlog

## Setup — blocked on account decisions (2026-11-24)
- [ ] **Vercel team.** The CLI/MCP only sees the team `bijan-zarrasvands-projects` (where
      booking-system lives). Decide: create a Vercel team for Svenskt Barnidrottsfrämjande
      (dashboard → Create Team) or reuse the existing one. Then `vercel link`, connect the
      GitHub repo (Settings → Git), `/deploy`.
- [ ] **Neon.** Preferred: `vercel integration add neon` on the linked project (Marketplace;
      injects `DATABASE_URL` + `DATABASE_URL_UNPOOLED`), then `vercel env pull .env.local`
      and `npm run db:migrate`. Fallback: a Neon account + `npx neonctl login`, create the
      project in `eu-central-1`, paste both connection strings into `.env.local`.
- [ ] Decide **auth** (Neon Auth / Auth.js / app-owned e-mail codes like booking-system
      Plan 225) before the first member-facing page.
- [ ] Repo visibility: `tennis-bokning` was created **public**; booking-system is private.
      Confirm that is intended.

## Open — features
- [ ] Plan 1: data model (clubs, courts, opening hours, bookings, members) + first migration
      after `clubs`.
- [ ] Plan 2: public booking page for one club (court × time grid).
