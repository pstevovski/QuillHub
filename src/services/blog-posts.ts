import "dotenv/config";

// Utilities
import handleErrorMessage from "@/utils/handleErrorMessage";

// Drizzle
import db from "@/db/connection";
import { eq, sql } from "drizzle-orm";
import { postsImagesSchema, postsSchema } from "@/db/schema/posts";

// Services
import UploadService, {
  UPLOADTHING_IMAGE_KEY_REGEX,
  UPLOADTHING_UPLOADED_IMAGE_BASE_URL,
} from "./uploads";
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
  private async saveBlogPostImageKeys({
    post_id,
    cover_image_keys,
    content_image_keys,
  }: BlogPostSaveImageKeys) {
    // If there are no image keys to be saved, exit early
    if (content_image_keys.length === 0 && cover_image_keys.length === 0) {
      return;
    }

    try {
      // Filter out duplicates and merge the keys into a single array
      const uniqueCoverImageKeys = [...new Set(cover_image_keys)];
      const uniqueContentImageKeys = [...new Set(content_image_keys)];
      const uniqueKeys = [...uniqueCoverImageKeys, ...uniqueContentImageKeys];

      // Include the ID of the post to which the uploaded image key belongs
      const postKeyPairs = uniqueKeys.map((imageKey) => {
        return {
          key: imageKey,
          post_id: post_id,
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
      console.log("Blog post successfully created!");

      // Save the pairings between the image keys and the newly created post
      await this.saveBlogPostImageKeys({
        post_id: newPost[0].insertId,
        cover_image_keys: UploadService.handleImageKeys(
          uploaded_cover_images_keys,
          cover_photo
        ),
        content_image_keys: UploadService.handleImageKeys(
          uploaded_content_images_keys,
          content
        ),
      });
    } catch (error) {
      console.log(
        `BLOG POSTS - Failed creating new blog post: ${handleErrorMessage(
          error
        )}`
      );
      throw new Error(handleErrorMessage(error));
    }
  }

  /**
   *
   * Edit the targeted blog post
   *
   * @param blogPostID ID of the blog post to be updated
   * @param {Object} updatedDetails
   *
   */
  async edit(blogPostID: number, updatedDetails: BlogNewPostPayload) {
    try {
      // Check if the targeted blog post exists
      const targetedBlogPost = await db
        .select()
        .from(postsSchema)
        .where(eq(postsSchema.id, blogPostID));

      if (!targetedBlogPost[0]) throw new Error(ApiErrorMessage.NOT_FOUND);

      // Prevent updates to the blog post by users that did not create it
      const currentUser = await UsersService.getCurrentUser();

      if (targetedBlogPost[0].created_by !== currentUser.id) {
        throw new Error(ApiErrorMessage.UNAUTHORIZED);
      }

      // Update the targeted blog post with the new details
      await db
        .update(postsSchema)
        .set({
          title: updatedDetails.title,
          status: updatedDetails.status,
          content: updatedDetails.content,
          cover_photo: updatedDetails.cover_photo,
          created_by: currentUser.id,
        })
        .where(eq(postsSchema.id, blogPostID));
      console.log("Blog post successfully updated!");

      // TODO: This must be refactored
      const alreadyExistingContentImageKeys =
        targetedBlogPost[0].content
          .match(UPLOADTHING_IMAGE_KEY_REGEX)
          ?.flatMap((key) => {
            return key.split(UPLOADTHING_UPLOADED_IMAGE_BASE_URL)[1];
          }) || [];

      const alreadyExistingCoverImageKeys =
        targetedBlogPost[0].cover_photo
          .match(UPLOADTHING_IMAGE_KEY_REGEX)
          ?.flatMap((key) => {
            return key.split(UPLOADTHING_UPLOADED_IMAGE_BASE_URL)[1];
          }) || [];

      const contentImageKeys = [
        ...alreadyExistingContentImageKeys,
        ...(updatedDetails.uploaded_content_images_keys
          ? [...updatedDetails.uploaded_content_images_keys]
          : []),
      ];

      const coverImageKeys = [
        ...alreadyExistingCoverImageKeys,
        ...(updatedDetails.uploaded_cover_images_keys
          ? [...updatedDetails.uploaded_cover_images_keys]
          : []),
      ];

      // extract keys that will be deleted
      const contentImageKeysToBeDeleted = [...contentImageKeys].filter(
        (key) => {
          if (!updatedDetails.content) return;

          return !updatedDetails?.content.includes(key);
        }
      );

      const coverImageKeysToBeDeleted = [...coverImageKeys].filter((key) => {
        if (!updatedDetails.cover_photo) return;

        return !updatedDetails.cover_photo.includes(key);
      });

      // send request to the API
      const editedBlogPostImages = await db
        .select()
        .from(postsImagesSchema)
        .where(eq(postsImagesSchema.post_id, blogPostID));

      // If there are any attached images, remove them from UploadThing's servers
      if (editedBlogPostImages.length > 0) {
        const keysToDelete = [
          ...contentImageKeysToBeDeleted,
          ...coverImageKeysToBeDeleted,
        ];

        await db
          .delete(postsImagesSchema)
          .where(sql`${postsImagesSchema.key} IN (${keysToDelete.join(",")})`);
      }
      // TODO: This must be refactored

      // Update the pairings between the image keys and the updated post
      await this.saveBlogPostImageKeys({
        post_id: blogPostID,
        cover_image_keys: UploadService.handleImageKeys(
          coverImageKeys,
          updatedDetails.cover_photo
        ),
        content_image_keys: UploadService.handleImageKeys(
          contentImageKeys,
          updatedDetails.content
        ),
      });
    } catch (error) {
      console.log(
        `BLOG POSTS - Failed editing blog post with ID ${blogPostID}: ${handleErrorMessage(
          error
        )}`
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
      // TODO: Move functionality to separate method
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
