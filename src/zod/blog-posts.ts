import { z } from "zod";

export const VALIDATION_SCHEMA_BLOG_POSTS_NEW = z.object({
  title: z
    .string({
      required_error: "Please enter the title for the blog post",
    })
    .min(5, "Please enter a title that is at least 5 characters long"),
  content: z
    .string({
      required_error: "Blog Post content is required",
    })
    .min(1, "Please enter the content of your blog post"),
  status: z.enum(["draft", "published"], {
    required_error: "Please select the status of the blog post",
  }),
  cover_photo: z
    .string({ required_error: "Blog Post cover photo is required" })
    .url("Please provide a valid cover photo URL."),
  topic_id: z.number({
    required_error: "Please select the topic of the blog post",
  }),
});
