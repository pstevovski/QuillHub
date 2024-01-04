import { sql } from "drizzle-orm";
import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  first_name: varchar("first_name", { length: 255 }).notNull(),
  last_name: varchar("last_name", { length: 255 }).notNull(),
  password: varchar("password", { length: 512 }).notNull(),
  biography: varchar("biography", { length: 1024 })
    .default(sql`null`)
    .$type<string | null>(),
  profile_picture: varchar("profile_picture", { length: 512 })
    .default(sql`null`)
    .$type<string | null>(),
});

export type User = typeof users.$inferSelect;
export type UserNew = typeof users.$inferInsert;
