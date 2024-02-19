import BlogPostsService from "@/services/posts";
import { VALIDATION_SCHEMA_BLOG_POSTS_NEW } from "@/zod/blog-posts";
import { NextResponse } from "next/server";
import { handlePayloadValidation } from "../handlePayloadValidation";
import { handleApiErrorResponse } from "../handleApiError";

/**
 *
 * Create a new blog post
 *
 */
export async function POST(request: Request) {
  try {
    const blogPostPayload = await request.json();

    // Validate the received payload
    await handlePayloadValidation(
      VALIDATION_SCHEMA_BLOG_POSTS_NEW,
      blogPostPayload
    );

    // Create the new blog post and save it in database
    await BlogPostsService.create(blogPostPayload);

    return NextResponse.json(
      { message: "Blog post created!" },
      { status: 200 }
    );
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
