import { sql } from "drizzle-orm";
import {
  bigint,
  mysqlEnum,
  mysqlTable,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";
import { roles } from "./roles";

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
});

export type User = typeof users.$inferSelect;
export type UserNew = typeof users.$inferInsert;

/** Bridge table between "Users" and "Roles"  */
export const userRoles = mysqlTable("user_roles", {
  user_id: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  role_id: bigint("role_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => roles.id),
});

export type UserRole = typeof userRoles.$inferSelect;
