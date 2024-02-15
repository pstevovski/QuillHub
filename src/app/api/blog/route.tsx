import BlogPostsService from "@/services/posts";
import TokenService from "@/services/token";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { BlogNewPostSchema } from "@/zod/blog-posts";
import { NextResponse } from "next/server";

/**
 *
 * Create a new blog post
 *
 */
export async function POST(request: Request) {
  try {
    const blogPostPayload = await request.json();
    const validatePayload = BlogNewPostSchema.safeParse({
      title: blogPostPayload.title,
      content: blogPostPayload.content,
      status: blogPostPayload.status,
    });

    // Extract the ID of the currently logged in user
    const decodedToken = await TokenService.decodeToken();

    if (!validatePayload || !decodedToken) {
      return Response.json(
        { error: "Invalid values provided!" },
        { status: 422 }
      );
    }

    await BlogPostsService.create({
      ...blogPostPayload,
      user_id: decodedToken.id,
    });

    return NextResponse.json(
      { message: "Blog post created!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: handleErrorMessage(error) },
      { status: 500 }
    );
  }
}
