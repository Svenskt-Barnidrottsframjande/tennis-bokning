-- Fixtures for the e2e suite only (applied by scripts/reset-db.ts after the migrations).
-- Specs look rows up by stable natural keys (slug) — never hardcode generated UUIDs.
insert into clubs (slug, name) values
  ('testklubben', 'Testklubben TK');
