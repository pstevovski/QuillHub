import UsersService from "@/services/users";
import { ApiErrorMessage, handleApiErrorResponse } from "../../handleApiError";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentUser = await UsersService.getCurrentUser();

    // If there's no user to be returned, throw a 401 error
    if (!currentUser) throw new Error(ApiErrorMessage.UNAUTHENTICATED);

    return NextResponse.json(currentUser, { status: 200 });
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
