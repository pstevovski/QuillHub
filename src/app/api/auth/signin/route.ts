// Utilities
import { NextResponse } from "next/server";
import { AuthSignInSchema } from "@/zod/auth";
import AuthService from "@/services/authentication";
import { handleApiErrorResponse } from "../../handleApiError";
import { handlePayloadValidation } from "../../handlePayloadValidation";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Validate the received payload
    await handlePayloadValidation(AuthSignInSchema, payload);

    // Sign in the user and issue tokens
    await AuthService.signIn(
      payload.email,
      payload.password,
      payload.remember_me
    );

    return NextResponse.json(
      { message: "Successfully signed in!" },
      { status: 200 }
    );
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
