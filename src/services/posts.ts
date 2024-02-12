import db from "@/db/connection";
import { postsImagesSchema, postsSchema } from "@/db/schema/posts";
import handleErrorMessage from "@/utils/handleErrorMessage";
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
}

const BlogPostsService = new BlogPosts();

export default BlogPostsService;
