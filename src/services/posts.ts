import "dotenv/config";

import db from "@/db/connection";
import { postsImagesSchema, postsSchema } from "@/db/schema/posts";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { eq } from "drizzle-orm";
import { UploadFileResponse } from "uploadthing/client";

interface BlogNewPostPayload {
  title: string;
  status: "draft" | "published";
  content: string;
  cover_photo: string;
  content_images: UploadFileResponse<unknown>[];
}

class BlogPosts {
  /**
   * Create a new blog post
   */
  async create({
    title,
    content,
    status,
    content_images,
    cover_photo,
  }: BlogNewPostPayload) {
    try {
      const newPost = await db.insert(postsSchema).values({
        title,
        status,
        content,
        cover_photo,
        likes: 0,
        views: 0,
      });

      // Append the ID of the created post to each of the attached images
      const attachedImages = content_images.map((attachedImage) => {
        return {
          ...attachedImage,
          post_id: newPost[0].insertId,
        };
      });
      await db.insert(postsImagesSchema).values(attachedImages);
      console.log("Created new blog post with ID: ", newPost[0].insertId);
    } catch (error) {
      console.log(
        `Failed creating new blog post: ${handleErrorMessage(error)}`
      );
      throw new Error("Failed creating new blog post!");
    }
  }

  /**
   * Delete an existing blog post along with
   * all images that were attached to it and uploaded
   * via UploadThing
   *
   * @param id - The corresponding Blog Post ID
   * @type integer
   *
   */
  async delete(blogPostID: number) {
    try {
      // Get all attached images keys that belong to the specific blog post
      const attachedImages = await db
        .select()
        .from(postsImagesSchema)
        .where(eq(postsImagesSchema.post_id, blogPostID));

      // If there are any attached images, remove them from UploadThing's servers
      if (attachedImages.length > 0) {
        // Extract the file keys
        const fileKeys = attachedImages.map((image) => image.key);

        fetch("https://uploadthing.com/api/deleteFile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Uploadthing-Api-Key": process.env.UPLOADTHING_SECRET || "",
          },
          body: JSON.stringify({ fileKeys }),
        });
      }

      // Remove blog post from the database
      await db.delete(postsSchema).where(eq(postsSchema.id, blogPostID));

      // todo: add API endpoint for this
    } catch (error) {
      console.log(`Failed deleting blog post: ${handleErrorMessage(error)}`);
      throw new Error("Failed deleting blog post!");
    }
  }
}

const BlogPostsService = new BlogPosts();

export default BlogPostsService;
