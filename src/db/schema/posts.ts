import {
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const postsSchema = mysqlTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  likes: int("likes").notNull().default(0),
  views: int("views").notNull().default(0),
  content: text("content").notNull(),
  cover_photo_url: varchar("cover_photo_url", { length: 512 }),
  status: mysqlEnum("status", ["draft", "published", "archived"])
    .default("draft")
    .notNull(),

  // todo: to be added later
  // topic_id: int("topic_id").notNull(),
});

export type Post = typeof postsSchema.$inferSelect;
export type PostsNew = typeof postsSchema.$inferInsert;
