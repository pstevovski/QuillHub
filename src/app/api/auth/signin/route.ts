// Utilities
import { NextResponse } from "next/server";
import { AuthSignInFields, AuthSignInSchema } from "@/zod/auth";
import type { NextRequest } from "next/server";
import handleErrorMessage from "@/utils/handleErrorMessage";
import AuthService from "@/services/authentication";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as AuthSignInFields;

  const validatePayload = AuthSignInSchema.safeParse({
    email: payload.email,
    password: payload.password,
    remember_me: payload.remember_me,
  });

  if (!validatePayload.success) {
    return Response.json(
      { error: "Please enter your email and password!" },
      { status: 422 }
    );
  }

  // Generate a new token that will be saved as HttpOnly cookie
  try {
    await AuthService.signIn(
      payload.email,
      payload.password,
      payload.remember_me
    );
    return NextResponse.json({ status: 200 });
  } catch (error) {
    const errorMessage: string = handleErrorMessage(error);
    const invalidCredentials = errorMessage
      .toLowerCase()
      .startsWith("invalid credentials");

    return Response.json(
      {
        error: invalidCredentials ? errorMessage : "Something went wrong!",
      },
      { status: invalidCredentials ? 422 : 500 }
    );
  }
}
