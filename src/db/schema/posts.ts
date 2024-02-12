import {
  bigint,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

/*====================================
  TABLE: POSTS
=====================================*/
export const postsSchema = mysqlTable("posts", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  likes: int("likes").notNull().default(0),
  views: int("views").notNull().default(0),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"])
    .default("draft")
    .notNull(),
  cover_photo: varchar("cover_photo", { length: 512 }).notNull(),

  // Todo: This will be implemented with a bridge table resulting in many-to-many relationship
  // topic_id: int("topic_id").notNull(),
});

export type Post = typeof postsSchema.$inferSelect;
export type PostsNew = typeof postsSchema.$inferInsert;

/*====================================
  TABLE: ATTACHED POST IMAGES 
=====================================*/
export const postsImagesSchema = mysqlTable("posts_images", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  key: varchar("key", { length: 512 }).notNull(),
  url: varchar("url", { length: 512 }).notNull(),
  name: varchar("name", { length: 512 }).notNull(),
  post_id: bigint("post_id", { mode: "number" }).references(
    () => postsSchema.id
  ),
});

export type PostAttachedImages = typeof postsImagesSchema.$inferSelect;
