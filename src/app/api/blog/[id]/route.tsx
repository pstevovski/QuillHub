import BlogPostsService from "@/services/blog-posts";
import { NextResponse } from "next/server";
import { handleApiErrorResponse } from "../../handleApiError";
import { handlePayloadValidation } from "../../handlePayloadValidation";
import { VALIDATION_SCHEMA_BLOG_POSTS_EDIT } from "@/zod/blog-posts";

export async function PUT(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const blogPostPayload = await request.json();

    // Validate the received payload
    await handlePayloadValidation(
      VALIDATION_SCHEMA_BLOG_POSTS_EDIT,
      blogPostPayload
    );

    await BlogPostsService.edit(params.id, blogPostPayload);

    return NextResponse.json(
      { message: "Blog post updated!" },
      { status: 200 }
    );
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}

/**
 *
 * Delete a specific blog post
 *
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: number } }
) {
  try {
    await BlogPostsService.delete(params.id);
    return NextResponse.json(
      { message: "Blog post deleted." },
      { status: 200 }
    );
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
