import AuthService from "@/services/authentication";
import { NextResponse } from "next/server";
import { handleApiErrorResponse } from "../../handleApiError";

export async function POST() {
  try {
    await AuthService.signOut();
    return NextResponse.json({ message: "User signed out" }, { status: 200 });
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
