// NextJS utilities
import { cookies } from "next/headers";

// Utilities
import handleErrorMessage from "@/utils/handleErrorMessage";
import { SignJWT, jwtVerify } from "jose";

class Token {
  public TOKEN_NAME: string = "jwt-token";

  /** Read secret key from ENV and encode it before returning for usage */
  private encodeJWTSecretKey() {
    const secretKey: string | undefined = process.env.JWT_SECRET_KEY;

    if (!secretKey)
      throw new Error(
        "The environment variable for JWT_SECRET_KEY is missing or invalid."
      );

    return new TextEncoder().encode(secretKey);
  }

  /** Issue a new token and save it as an HttpOnly cookie */
  async signToken(
    payload: Record<string, unknown>,
    remember_me: boolean = false
  ): Promise<string> {
    try {
      const iat = Math.floor(Date.now() / 1000);
      let exp = iat + 60 * 60 * 24; // Expires 24h from the moment it was issued

      // If user selected option to be remembered then extend expiration to 30 days
      if (remember_me) exp = iat + 60 * 60 * 24 * 30;

      const token = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(this.encodeJWTSecretKey());

      // Save the token in a cookie
      cookies().set({
        name: this.TOKEN_NAME,
        value: token,
        httpOnly: true,
        expires: exp * 1000,
      });

      return token;
    } catch (error) {
      throw new Error(handleErrorMessage(error));
    }
  }

  /** Verify the validity of the provided token */
  async verifyToken(token: string) {
    try {
      const { payload } = await jwtVerify(token, this.encodeJWTSecretKey());
      return payload;
    } catch (error) {
      throw new Error(
        `Token verification failed: ${handleErrorMessage(error)}`
      );
    }
  }

  /** Removes the HttpOnly cookie when user signs out of the application */
  async removeToken() {
    try {
      cookies().delete(this.TOKEN_NAME);
    } catch (error) {
      throw new Error(handleErrorMessage(error));
    }
  }
}

const TokenService = new Token();

export default TokenService;
