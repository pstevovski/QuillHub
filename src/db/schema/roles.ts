import { sql } from "drizzle-orm";
import { mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";

export const roles = mysqlTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 30 }).notNull().unique(),
  label: varchar("label", { length: 30 }).notNull(),
  description: varchar("description", { length: 255 })
    .default(sql`null`)
    .$type<string | null>(),
  created_at: timestamp("created_at", { mode: "date", fsp: 6 }).defaultNow(),
});

export type Role = typeof roles.$inferSelect;
export type RoleNew = typeof roles.$inferInsert;
