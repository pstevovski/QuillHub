import BlogPostsService, { Filters } from "@/services/blog-posts";
import { VALIDATION_SCHEMA_BLOG_POSTS_NEW } from "@/zod/blog-posts";
import { NextRequest, NextResponse } from "next/server";
import { handlePayloadValidation } from "../handlePayloadValidation";
import { handleApiErrorResponse } from "../handleApiError";

/**
 *
 * Get a list of all existing blog posts
 *
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const search = searchParams.get("search");

    const filters: Filters = {
      page: pageParam ? parseInt(pageParam) : 0,
      limit: limitParam ? parseInt(limitParam) : 10,
      search,
    };

    if (isNaN(filters.page) || isNaN(filters.limit)) {
      return NextResponse.json(
        { results: [], total_results: 0 },
        { status: 200 }
      );
    }

    const { posts, totalResults } = await BlogPostsService.getAll(filters);

    return NextResponse.json(
      { results: posts, total_results: totalResults },
      { status: 200 }
    );
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}

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
