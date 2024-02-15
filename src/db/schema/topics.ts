import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";

export const schemaTopics = mysqlTable("topics", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 32 }).unique().notNull(),
  label: varchar("label", { length: 32 }).notNull(),
  created_by: bigint("created_by", { mode: "number" })
    .notNull()
    .references(() => users.id),
  created_at: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});
