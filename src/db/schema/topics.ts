import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";

export const schemaTopics = mysqlTable("topics", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 32 }).unique().notNull(),
  slug: varchar("slug", { length: 32 }).unique().notNull(),
  created_by: bigint("created_by", { mode: "number" }).references(
    () => users.id,
    { onDelete: "set null" }
  ),
  created_at: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export type Topic = typeof schemaTopics.$inferSelect;
export type TopicNew = typeof schemaTopics.$inferInsert;
