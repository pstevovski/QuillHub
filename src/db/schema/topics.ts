import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { postsSchema } from "./posts";

export const schemaTopics = mysqlTable("topics", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 32 }).unique().notNull(),
  label: varchar("label", { length: 32 }).notNull(),
  created_by: bigint("created_by", { mode: "number" })
    .notNull()
    .references(() => users.id),
  created_at: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

/*====================================
  TABLE: BLOG POST TOPICS 
=====================================*/
export const schemaTopicsBlogPosts = mysqlTable("topics_blog_posts", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  post_id: bigint("post_id", { mode: "number" }).references(
    () => postsSchema.id
  ),
  topic_id: bigint("topic_id", { mode: "number" }).references(
    () => schemaTopics.id
  ),
});
