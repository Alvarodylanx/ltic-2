import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const pageViews = pgTable("page_views", {
  id:        serial("id").primaryKey(),
  page:      text("page").notNull(),
  sessionId: text("session_id").notNull(),
  date:      text("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type PageView = typeof pageViews.$inferSelect;
export type NewPageView = typeof pageViews.$inferInsert;
