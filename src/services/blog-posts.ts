import "dotenv/config";

// Utilities
import handleErrorMessage from "@/utils/handleErrorMessage";

// Drizzle
import db from "@/db/connection";
import { eq } from "drizzle-orm";
import { postsImagesSchema, postsSchema } from "@/db/schema/posts";

// Services
import UploadService from "./uploads";
import { ApiErrorMessage } from "@/app/api/handleApiError";
import UsersService from "./users";

interface BlogNewPostPayload {
  title: string;
  status: "draft" | "published";
  content: string;
  cover_photo: string;
  uploaded_content_images_keys: string[];
  uploaded_cover_images_keys: string[];
}

interface BlogPostSaveImageKeys {
  post_id: number;
  cover_image_keys: string[];
  content_image_keys: string[];
}

class BlogPosts {
  /**
   *
   * Filter out all duplicate uploaded image keys,
   * merge both 'cover' and 'content' key arrays into one array,
   * map over the merged array and add the ID of the post to which the image key corresponds to
   * before saving the "post" / "image key" pairings inn the database
   *
   */
  private async saveBlogPostImageKeys(postImageKeys: BlogPostSaveImageKeys) {
    try {
      // Filter out duplicates and merge the keys into a single array
      const uniqueCoverImageKeys = [...new Set(postImageKeys.cover_image_keys)];
      const uniqueContentImageKeys = [
        ...new Set(postImageKeys.content_image_keys),
      ];
      const uniqueKeys = [...uniqueCoverImageKeys, ...uniqueContentImageKeys];

      // Include the ID of the post to which the uploaded image key belongs
      const postKeyPairs = uniqueKeys.map((imageKey) => {
        return {
          key: imageKey,
          post_id: postImageKeys.post_id,
        };
      });

      // Do not save anything to the database if there are no keys to be saved
      if (!postKeyPairs.length) return;

      await db.insert(postsImagesSchema).values(postKeyPairs);
      console.log(
        "Blog post 'cover' and 'content' image keys saved to database"
      );
    } catch (error) {
      console.log("Failed saving the keys of the uploaded images to database.");
      throw new Error(handleErrorMessage(error));
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
      const currentUser = await UsersService.getCurrentUser();
      const newPost = await db.insert(postsSchema).values({
        title,
        status,
        content,
        cover_photo,
        created_by: currentUser.id,
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
      console.log("Blog post successfully created!");

      // Save the pairings between the image keys and the newly created post
      await this.saveBlogPostImageKeys({
        post_id: newPost[0].insertId,
        content_image_keys: uploadedContentImages.imagesToBeSaved,
        cover_image_keys: uploadedCoverImages.imagesToBeSaved,
      });

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
      throw new Error(handleErrorMessage(error));
    }
  }

  /**
   * Delete an existing blog post along with
   * all images that were attached to it and uploaded
   * via UploadThing
   *
   * @param id - The corresponding Blog Post ID
   *
   */
  async delete(blogPostID: number) {
    try {
      const currentUser = await UsersService.getCurrentUser();

      // Find the matching blog post that should be deleted
      const targetedBlogPost = await db
        .select()
        .from(postsSchema)
        .where(eq(postsSchema.id, blogPostID));

      // Throw if the blog post does not exist
      if (!targetedBlogPost[0]) throw new Error(ApiErrorMessage.NOT_FOUND);

      // Prevent deletion if user that didnt create the blog post tries to delete it
      // Or if the user thats trying to delete the blog post is not an admin
      if (targetedBlogPost[0].created_by !== currentUser.id) {
        throw new Error(ApiErrorMessage.UNAUTHORIZED);
      }

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
      throw new Error(handleErrorMessage(error));
    }
  }
}

const BlogPostsService = new BlogPosts();

export default BlogPostsService;
