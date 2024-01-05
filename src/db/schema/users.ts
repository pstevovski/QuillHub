import { sql } from "drizzle-orm";
import {
  mysqlEnum,
  mysqlTable,
  serial,
  varchar,
  timestamp,
  bigint,
} from "drizzle-orm/mysql-core";

/*===========================================
  TABLE: USERS
============================================*/
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  first_name: varchar("first_name", { length: 255 }).notNull(),
  last_name: varchar("last_name", { length: 255 }).notNull(),
  password: varchar("password", { length: 512 }).notNull(),
  biography: varchar("biography", { length: 1024 })
    .default(sql`null`)
    .$type<string | null>(),
  profile_picture: varchar("profile_picture", { length: 512 })
    .default(sql`null`)
    .$type<string | null>(),
  theme: mysqlEnum("theme", ["light", "dark", "system"])
    .default("light")
    .notNull(),
  role_id: bigint("role_id", { mode: "number", unsigned: true }) // FK
    .notNull()
    .references(() => roles.id),
});

export type User = typeof users.$inferSelect;
export type UserNew = typeof users.$inferInsert;

/*===========================================
  TABLE: ROLES
============================================*/
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
