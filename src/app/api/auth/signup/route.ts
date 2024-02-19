import AuthService from "@/services/authentication";
import { AuthSignUpSchema } from "@/zod/auth";
import { handlePayloadValidation } from "../../handlePayloadValidation";
import { handleApiErrorResponse } from "../../handleApiError";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Validate the received payload
    await handlePayloadValidation(AuthSignUpSchema, payload);

    // Create a new user in the system
    await AuthService.signUp(payload);

    return Response.json(
      { message: "User registered successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
