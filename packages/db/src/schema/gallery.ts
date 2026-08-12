import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  titleEn: text("title_en"),
  titleFr: text("title_fr"),
  category: text("category"),
  mediaUrl: text("media_url").notNull(),
  mediaType: text("media_type").notNull().default("image"),
  sortOrder: integer("sort_order").default(0),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type GalleryItem = typeof galleryItems.$inferSelect;
export type NewGalleryItem = typeof galleryItems.$inferInsert;
