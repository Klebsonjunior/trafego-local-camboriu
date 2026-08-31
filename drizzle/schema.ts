import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  business: varchar("business", { length: 180 }).notNull(),
  city: varchar("city", { length: 160 }).notNull(),
  invests: varchar("invests", { length: 120 }).notNull(),
  objective: varchar("objective", { length: 160 }).notNull(),
  budget: varchar("budget", { length: 120 }).notNull(),
  source: varchar("source", { length: 120 }).notNull().default("kriaat-trafego-pago"),
  page: varchar("page", { length: 255 }),
  utmSource: varchar("utmSource", { length: 160 }),
  utmMedium: varchar("utmMedium", { length: 160 }),
  utmCampaign: varchar("utmCampaign", { length: 160 }),
  utmContent: varchar("utmContent", { length: 160 }),
  consent: int("consent").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// TODO: Add your tables here