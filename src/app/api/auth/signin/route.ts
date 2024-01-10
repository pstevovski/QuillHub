// Utilities
import { NextRequest, NextResponse } from "next/server";
import handleErrorMessage from "@/utils/handleErrorMessage";
import TokenService from "@/services/token";

export async function POST(request: NextRequest) {
  const payload = await request.json();

  // todo: validate the payload that is received
  // todo: add check for the email/password combination
  // todo: add 'signin' method in the auth service to handle this
  // todo: move signing the token within that method
  // todo: update the payload that will be saved within the token to include "Remember Me" field

  // Generate a new token that will be saved as HttpOnly cookie
  try {
    await TokenService.signToken(payload);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(`Sign In failed: ${handleErrorMessage(error)}`);
    return Response.json(
      { error: "Sign In failed. Something went wrong!" },
      { status: 500 }
    );
  }
}
