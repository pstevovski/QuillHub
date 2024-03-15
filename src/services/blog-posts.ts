import "dotenv/config";

// Utilities
import handleErrorMessage from "@/utils/handleErrorMessage";

// Drizzle
import db from "@/db/connection";
import { eq, sql } from "drizzle-orm";
import { Post, postsImagesSchema, postsSchema } from "@/db/schema/posts";

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
  private async saveImageKeys({
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
        "BLOG POST - 'cover' and 'content' image keys saved to database"
      );
    } catch (error) {
      console.log("Failed saving the keys of the uploaded images to database.");
      throw new Error(handleErrorMessage(error));
    }
  }

  /**
   *
   * Delete the images of the targeted blog post from the database
   * and trigger API call to remove them from Uploadthing.
   *
   * If no specific image keys are being passed as the second argument,
   * then all of the images associated with the targeted blog post will be deleted.
   *
   * Otherwise only the specifically targeted images will be deleted.
   *
   * @param postID The ID of the targeted blog post
   * @param specificImageKeys List of specific image keys that we want to delete
   *
   */
  private async deleteUnusedImages(
    postID: number,
    specificImageKeys: string[] | null = null
  ) {
    try {
      // Find the blog post to which the attached images belong to
      const blogPostImages = await db
        .select()
        .from(postsImagesSchema)
        .where(eq(postsImagesSchema.post_id, postID));

      // Do not do anything if the targeted blog post does not exit
      if (!blogPostImages) return;

      // If no image keys parameter is received, remove all images that belong to the blog post
      // Otherwise delete only those images that were specified
      let keysToDelete = specificImageKeys || [];

      // Extract the keys of images that exist in the database for the targeted blog post
      if (!specificImageKeys) {
        keysToDelete = blogPostImages.map((image) => image.key);
      }

      // Do not do anything i there are no keys to be deleted
      if (!keysToDelete.length) return;

      // Delete the unused image keys from the database
      await db
        .delete(postsImagesSchema)
        .where(sql`${postsImagesSchema.key} IN ${keysToDelete}`);

      // Delete the images from Uploadthing that are associated with the specific keys
      await UploadService.deleteUploadedFiles(keysToDelete);

      console.log(
        `BLOG POSTS - Unused images for blog post with ID ${postID} were successfully removed.`
      );
    } catch (error) {
      console.log(
        `BLOG POSTS - Failed removing blog post images: ${handleErrorMessage(
          error
        )}`
      );
      throw new Error(handleErrorMessage(error));
    }
  }

  /**
   *
   * Extract only the unused "cover" and "content" image keys
   * so they can be removed both from the database and Uploadthing
   *
   * @param existingData
   * @param updatedData
   *
   */
  private extractUnusedImageKeys(
    existingData: Post,
    updatedData: BlogNewPostPayload
  ): string[] {
    let unusedImageKeys: string[] = [];

    const { cover_photo: old_cover_photo } = existingData;
    const { cover_photo: new_cover_photo, content: new_content } = updatedData;

    // If the cover photo was updated, mark the previously existing one for removal
    // As the cover photo is saved in the following format: "https://utfs.io/f/<key>"
    // this will extract only the "key" part of the URL
    if (new_cover_photo && new_cover_photo !== old_cover_photo) {
      unusedImageKeys.push(
        old_cover_photo.split(UPLOADTHING_UPLOADED_IMAGE_BASE_URL)[1]
      );
    }

    // If the main content of blog post was updated, extract all of the
    // pre-update images that were uploaded to Uploadthing and mark them for deletion
    if (new_content) {
      const { content: preUpdateContent } = existingData;

      // Find all images that existed in the blog post content pre-update
      let contentImages: string[] = [];
      const checkExistingContentImages = preUpdateContent.match(
        UPLOADTHING_IMAGE_KEY_REGEX
      );

      if (checkExistingContentImages) {
        contentImages = checkExistingContentImages.flatMap((imageKey) => {
          return imageKey;
        });
      }

      // Compare the updated content against the list of content image keys (pre and after update)
      // Those image keys that are not present in the updated content get marked for deletion
      const contentImageKeysDiff = contentImages.filter((imageKey) => {
        return !new_content.includes(imageKey);
      });

      unusedImageKeys = [...unusedImageKeys, ...contentImageKeysDiff];
    }

    return unusedImageKeys;
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
      await this.saveImageKeys({
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
   * @param {Object} updatedDetails The updated details of the blog post
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

      // Save the updated cover and content images
      await this.saveImageKeys({
        post_id: blogPostID,
        cover_image_keys: UploadService.handleImageKeys(
          updatedDetails.uploaded_cover_images_keys,
          updatedDetails.cover_photo
        ),
        content_image_keys: UploadService.handleImageKeys(
          updatedDetails.uploaded_content_images_keys,
          updatedDetails.content
        ),
      });

      // Delete the unused blog post images
      await this.deleteUnusedImages(
        blogPostID,
        this.extractUnusedImageKeys(targetedBlogPost[0], updatedDetails)
      );
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

      // Delete all images associated with this blog post
      await this.deleteUnusedImages(blogPostID);

      // Remove the blog post from the database
      await db.delete(postsSchema).where(eq(postsSchema.id, blogPostID));
    } catch (error) {
      console.log(
        `BLOG POST - Failed deleting blog post: ${handleErrorMessage(error)}`
      );
      throw new Error(handleErrorMessage(error));
    }
  }
}

const BlogPostsService = new BlogPosts();

export default BlogPostsService;
