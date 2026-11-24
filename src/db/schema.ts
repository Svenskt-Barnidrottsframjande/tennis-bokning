// Drizzle schema — the single source of truth for the database shape.
//
// Workflow: edit this file → `npm run db:generate` (writes a SQL migration under
// drizzle/) → review the SQL → `npm run db:migrate` (applies it to DATABASE_URL_UNPOOLED).
// Never hand-edit a generated migration that has already been applied somewhere.
//
// Keep this file free of `server-only` and app imports: drizzle-kit bundles it on its own.
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Starter table so the migration chain, the health route and the e2e suite have
// something real to touch. Shape it further in the first data-model plan.
export const clubs = pgTable("clubs", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Club = typeof clubs.$inferSelect;
export type NewClub = typeof clubs.$inferInsert;
