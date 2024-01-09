import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import handleErrorMessage from "./handleErrorMessage";

export const JWT_USER_TOKEN_NAME: string = "jwt-token";

// todo: do we even need this?
function getJWTSecretKey() {
  const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET_KEY!;

  if (!JWT_SECRET_KEY) {
    throw new Error(
      "The environment variable JWT_SECRET_KEY has not been set correctly."
    );
  }

  return new TextEncoder().encode(JWT_SECRET_KEY);
}

// todo: add comments
// todo: move to auth service
export async function signToken(payload: Record<string, unknown>) {
  try {
    // Time when the token was issued
    const iat = Math.floor(Date.now() / 1000);

    // When the token expires -> 1h from the moment when it was issued
    const exp = iat + 60 * 60;

    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(exp)
      .setIssuedAt(iat)
      .setNotBefore(iat)
      .sign(getJWTSecretKey());

    // Save the newly signed token in HttpOnly cookie
    cookies().set({
      name: JWT_USER_TOKEN_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      expires: exp * 1000,
    });

    return token;
  } catch (error) {
    throw new Error(handleErrorMessage(error));
  }
}

// todo: add comments
export async function verifyToken(token: string) {
  if (!token) throw new Error("Invalid or missing token!");

  try {
    const { payload } = await jwtVerify(token, getJWTSecretKey());
    return payload;
  } catch (error) {
    throw new Error("Failed verifying token!");
  }
}
