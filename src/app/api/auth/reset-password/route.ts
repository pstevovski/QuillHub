import AuthService from "@/services/authentication";
import { VALIDATION_SCHEMA_AUTH_RESET_PASSWORD } from "@/zod/auth";
import { handlePayloadValidation } from "../../handlePayloadValidation";
import { handleApiErrorResponse } from "../../handleApiError";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Validate the received payload
    await handlePayloadValidation(
      VALIDATION_SCHEMA_AUTH_RESET_PASSWORD,
      payload
    );

    // Update the password of the user
    await AuthService.resetPassword(payload.token, payload.password);

    return Response.json(
      { message: "Your password was successfully reset" },
      { status: 200 }
    );
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
