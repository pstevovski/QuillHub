import BlogPostsService from "@/services/posts";
import { NextResponse } from "next/server";
import { handleApiErrorResponse } from "../../handleApiError";

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
