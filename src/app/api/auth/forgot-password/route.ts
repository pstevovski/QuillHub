import AuthService from "@/services/authentication";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { AuthForgotPasswordSchema } from "@/zod/auth";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Check the received payload and if its not valid,
    // throw an error and prevent saving the entry to the database
    const validatePayload = AuthForgotPasswordSchema.safeParse({
      email: payload.email,
    });

    if (!validatePayload.success) {
      return Response.json(
        { error: "Missing or invalid value provided!" },
        { status: 422 }
      );
    }

    // Save the user in the database
    await AuthService.forgotPassword(payload.email);

    return Response.json(
      { message: "Email sent! Please check your inbox." },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: handleErrorMessage(error) }, { status: 500 });
  }
}
