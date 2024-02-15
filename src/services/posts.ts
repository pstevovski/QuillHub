import "dotenv/config";

import db from "@/db/connection";
import { postsImagesSchema, postsSchema } from "@/db/schema/posts";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { eq } from "drizzle-orm";
import UploadService from "./uploads";
import TokenService from "./token";

interface BlogNewPostPayload {
  title: string;
  status: "draft" | "published";
  content: string;
  cover_photo: string;
  uploaded_content_images_keys: string[];
  uploaded_cover_images_keys: string[];
}

class BlogPosts {
  /**
   * Create a new blog post
   */
  async create({
    title,
    content,
    status,
    uploaded_cover_images_keys,
    uploaded_content_images_keys,
    cover_photo,
  }: BlogNewPostPayload) {
    try {
      // Extract the currently logged in user's ID
      const userToken = await TokenService.decodeToken();

      if (!userToken) throw new Error("Unauthenticated!");

      const newPost = await db.insert(postsSchema).values({
        title,
        status,
        content,
        cover_photo,
        likes: 0,
        views: 0,
        created_by: userToken.id as number,
      });

      // Extract the keys for those cover and content images
      // that are to be saved in the database and
      // the ones that are to be remvoed from Uploadthing's servers
      const uploadedCoverImages = UploadService.handleImageKeys(
        uploaded_cover_images_keys,
        cover_photo
      );
      const uploadedContentImages = UploadService.handleImageKeys(
        uploaded_content_images_keys,
        content
      );

      // Map the keys of those images that will be saved in the database
      // to include the ID of the newly created post
      const uploadedImagesKeys = [
        ...uploadedCoverImages.imagesToBeSaved,
        ...uploadedContentImages.imagesToBeSaved,
      ].map((imageKey) => {
        return {
          key: imageKey,
          post_id: newPost[0].insertId,
        };
      });

      // todo: move this to separate method
      if (uploadedImagesKeys.length > 0) {
        await db.insert(postsImagesSchema).values(uploadedImagesKeys);
      }

      console.log("Blog post successfully created!");

      // Delete images that were uploaded while user was creating the blog post
      // but ended up not being used in the final version of the post
      console.log(
        "Deleting unused images that are uploaded to Uploadthing servers..."
      );

      UploadService.deleteImagesFromUploadthing(
        uploadedCoverImages.imagesToBeRemoved
      );

      UploadService.deleteImagesFromUploadthing(
        uploadedContentImages.imagesToBeRemoved
      );

      console.log(
        "Unused images successfully deleted from Uploadthing servers!"
      );
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
        // Extract the unique file keys for each of the uploaded images
        const fileKeys = attachedImages.map((image) => image.key);

        // Remove the uploaded image URLs (including the cover photo)
        // associated with the blog post from the database
        await db
          .delete(postsImagesSchema)
          .where(eq(postsImagesSchema.post_id, blogPostID));

        // Delete images from Uploadthing servers after deleting them from database
        await UploadService.deleteImagesFromUploadthing(fileKeys);
      }

      // Remove the blog post from the database
      await db.delete(postsSchema).where(eq(postsSchema.id, blogPostID));
    } catch (error) {
      console.log(`Failed deleting blog post: ${handleErrorMessage(error)}`);
      throw new Error("Failed deleting blog post!");
    }
  }
}

const BlogPostsService = new BlogPosts();

export default BlogPostsService;
