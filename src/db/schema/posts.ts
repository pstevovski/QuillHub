import {
  bigint,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { users } from "./users";
import { schemaTopics } from "./topics";

/*====================================
  TABLE: POSTS
=====================================*/
export const postsSchema = mysqlTable("posts", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"])
    .default("draft")
    .notNull(),
  cover_photo: varchar("cover_photo", { length: 512 }).notNull(),
  likes: int("likes").notNull().default(0),
  views: int("views").notNull().default(0),
  created_by: bigint("created_by", { mode: "number" })
    .references(() => users.id)
    .notNull(),
  created_at: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .onUpdateNow(),
  topic_id: bigint("topic_id", { mode: "number" }).references(
    () => schemaTopics.id,
    {
      onDelete: "set null",
    }
  ),
});

export type Post = typeof postsSchema.$inferSelect;
export type PostsNew = typeof postsSchema.$inferInsert;

/*====================================
  TABLE: ATTACHED POST IMAGES 
=====================================*/
export const postsImagesSchema = mysqlTable("posts_images", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  post_id: bigint("post_id", { mode: "number" }).references(
    () => postsSchema.id,
    {
      onDelete: "cascade",
    }
  ),
  key: varchar("key", { length: 512 }).notNull(),
});

export type PostAttachedImages = typeof postsImagesSchema.$inferSelect;
