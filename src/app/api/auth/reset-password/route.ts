import AuthService from "@/services/authentication";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { AuthResetPasswordSchema } from "@/zod/auth";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Check the received payload and if its not valid,
    // throw an error and prevent saving the entry to the database
    const validatePayload = AuthResetPasswordSchema.safeParse({
      token: payload.token,
      password: payload.password,
      confirm_password: payload.confirm_password,
    });

    if (!validatePayload.success) {
      return Response.json(
        { error: "Invalid values provided!" },
        { status: 422 }
      );
    }

    // Save the user in the database
    await AuthService.resetPassword(payload.token, payload.password);

    return Response.json(
      { message: "Your password was successfully reset" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: handleErrorMessage(error) }, { status: 500 });
  }
}
