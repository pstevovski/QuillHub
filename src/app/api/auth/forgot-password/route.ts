import AuthService from "@/services/authentication";
import { AuthForgotPasswordSchema } from "@/zod/auth";
import { handlePayloadValidation } from "../../handlePayloadValidation";
import { handleApiErrorResponse } from "../../handleApiError";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Validate the received payload
    await handlePayloadValidation(AuthForgotPasswordSchema, payload);

    // Save the user in the database
    await AuthService.forgotPassword(payload.email);

    return Response.json(
      { message: "Email sent! Please check your inbox." },
      { status: 200 }
    );
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
