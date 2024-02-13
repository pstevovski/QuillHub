import "dotenv/config";

import db from "@/db/connection";
import { postsImagesSchema, postsSchema } from "@/db/schema/posts";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { eq } from "drizzle-orm";

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
   *
   * Get the keys of the uploaded images.
   *
   * `imagesToBeRemoved` contains the keys of those images
   * that were uploaded to Uploadthing servers but are not used in the blog post
   *
   * `imagesToBeSaved` contains the keys of those images
   * that were uploaded to Uploadthing servers and will be used in the blog post
   *
   * @param keys List of keys, either `cover` or `content` images keys
   * @param source Check against this source, can be either the `content` or the `cover_photo`
   */
  private getImageKeys(keys: string[], source: string) {
    if (!keys.length || !source)
      return {
        imagesToBeSaved: [],
        imagesToBeRemoved: [],
      };

    const imagesToBeRemoved: string[] = [...keys].filter((key) => {
      return !source.includes(key);
    });

    const imagesToBeSaved: string[] = [...keys].filter((key) => {
      return source.includes(key);
    });

    return { imagesToBeRemoved, imagesToBeSaved };
  }

  /**
   *
   * Deletes images that were uploaded to Uploadthing servers
   * but won't be used anymore, in order to free up unused space.
   *
   * @param imageKeys List of unique `file keys` corresponding
   * to the files that will be deleted from Uploadthing servers.
   *
   */
  private async deleteImagesFromUploadthing(imageKeys: string[]) {
    try {
      await fetch("https://uploadthing.com/api/deleteFile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Uploadthing-Api-Key": process.env.UPLOADTHING_SECRET || "",
        },
        body: JSON.stringify({ fileKeys: imageKeys }),
      });

      console.log(
        "Unused images successfully removed from Uploadthing servers."
      );
    } catch (error) {
      throw new Error("Failed deleting unused images!");
    }
  }

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
      const newPost = await db.insert(postsSchema).values({
        title,
        status,
        content,
        cover_photo,
        likes: 0,
        views: 0,
      });

      // Extract the keys for those cover and content images
      // that are to be saved in the database and
      // the ones that are to be remvoed from Uploadthing's servers
      const uploadedCoverImages = this.getImageKeys(
        uploaded_cover_images_keys,
        cover_photo
      );
      const uploadedContentImages = this.getImageKeys(
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
      await db.insert(postsImagesSchema).values(uploadedImagesKeys);

      console.log("Blog post successfully created!");
      console.log("");
      console.log("");

      // Delete images that were uploaded while user was creating the blog post
      // but ended up not being used in the final version of the post
      console.log(
        "Deleting unused images that are uploaded to Uploadthing servers..."
      );
      this.deleteImagesFromUploadthing(uploadedCoverImages.imagesToBeRemoved); // Cover images
      this.deleteImagesFromUploadthing(uploadedContentImages.imagesToBeRemoved); // Content images
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
        await this.deleteImagesFromUploadthing(fileKeys);
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
