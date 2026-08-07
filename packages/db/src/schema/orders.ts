import { pgTable, serial, integer, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export interface OrderTimelineItem {
  status: string;
  date: string;
  description: string;
  location?: string;
}

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  trackingNumber: text("tracking_number").notNull().unique(),
  customerId: integer("customer_id"),
  quoteId: integer("quote_id").unique(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email"),
  origin: text("origin"),
  destination: text("destination"),
  description: text("description"),
  status: text("status").notNull().default("processing"),
  estimatedDelivery: text("estimated_delivery"),
  timeline: jsonb("timeline").$type<OrderTimelineItem[]>().default([]),
  currentLat: text("current_lat"),
  currentLng: text("current_lng"),
  currentLocationLabel: text("current_location_label"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
