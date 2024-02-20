import UsersService from "@/services/users";
import { handleApiErrorResponse } from "../../handleApiError";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentUser = await UsersService.getCurrentUser();
    return NextResponse.json(currentUser, { status: 200 });
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
