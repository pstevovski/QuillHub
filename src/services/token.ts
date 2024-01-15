// NextJS utilities
import { cookies } from "next/headers";

// Utilities
import handleErrorMessage from "@/utils/handleErrorMessage";
import { SignJWT, decodeJwt, jwtVerify } from "jose";

class Token {
  public ACCESS_TOKEN_NAME: string = "jwt-access-token";
  public REFRESH_TOKEN_NAME: string = "jwt-refresh-token";
  private ACCESS_TOKEN_EXP: number = 60 * 60; // 1 hour

  private encodedAccessTokenSecretKey() {
    const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
    if (!accessTokenSecret) {
      throw new Error(
        "The environment variable for JWT_ACCESS_TOKEN_SECRET_KEY is missing or invalid."
      );
    }

    return new TextEncoder().encode(accessTokenSecret);
  }

  private encodedRefreshTokenSecretKey() {
    const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
    if (!refreshTokenSecret) {
      throw new Error(
        "The environment variable for JWT_REFRESH_TOKEN_SECRET_KEY is missing or invalid."
      );
    }

    return new TextEncoder().encode(refreshTokenSecret);
  }

  /**
   * Issue a new token and save it as an HttpOnly cookie
   *
   * Returns a timestamp representing the expiration date of the issued `"access"` token.
   **/
  async issueNewTokens(
    payload: Record<string, unknown>,
    remember_me: boolean = false
  ): Promise<number> {
    try {
      const iat = Math.floor(Date.now() / 1000);
      let accessTokenExpiration = iat + this.ACCESS_TOKEN_EXP; // Expires 1h from when it was issued
      let refreshTokenExpiration = iat + this.ACCESS_TOKEN_EXP * 8; // Expires 8h from when it was issued

      // If user selected option to be remembered, increase the duration of the tokens
      if (remember_me) {
        accessTokenExpiration = iat + this.ACCESS_TOKEN_EXP * 24 * 30; // 30 days
        refreshTokenExpiration = iat + this.ACCESS_TOKEN_EXP * 24 * 90; // 90 days
      }

      // Access token and cookie
      const accessToken = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime(accessTokenExpiration)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(this.encodedAccessTokenSecretKey());

      cookies().set({
        name: this.ACCESS_TOKEN_NAME,
        value: accessToken,
        httpOnly: true,
        expires: accessTokenExpiration * 1000,
      });

      // Refresh token and cookie
      const refreshToken = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime(refreshTokenExpiration)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(this.encodedRefreshTokenSecretKey());

      cookies().set({
        name: this.REFRESH_TOKEN_NAME,
        value: refreshToken,
        httpOnly: true,
        expires: refreshTokenExpiration * 1000,
      });

      return accessTokenExpiration * 1000;
    } catch (error) {
      throw new Error(handleErrorMessage(error));
    }
  }

  /** Verify the validity of the provided token */
  async verifyToken(token: string | undefined) {
    // Do not try to verify non-existing token
    if (!token) return;

    try {
      const { payload } = await jwtVerify(
        token,
        this.encodedAccessTokenSecretKey()
      );
      return payload;
    } catch (error) {
      console.error(
        `ERROR: Token verification failed: ${handleErrorMessage(error)}`
      );
      return false;
    }
  }

  /** Decodes the provided token containing some user-specific details */
  async decodeToken(token: string) {
    if (!token) return;

    try {
      const decodedToken = decodeJwt(token);
      return decodedToken;
    } catch (error) {
      console.log(`Failed decoding token: ${handleErrorMessage(error)}`);
      throw new Error("Failed decoding token!");
    }
  }

  /** Removes the tokens that were issued to the user from cookies */
  async clearTokens() {
    await TokenService.removeToken(TokenService.ACCESS_TOKEN_NAME);
    await TokenService.removeToken(TokenService.REFRESH_TOKEN_NAME);
  }

  private async removeToken(token: string) {
    if (!token) return;
    try {
      cookies().delete(token);
    } catch (error) {
      throw new Error(handleErrorMessage(error));
    }
  }
}

const TokenService = new Token();

export default TokenService;
