// NextJS utilities
import { cookies } from "next/headers";

// Utilities
import handleErrorMessage from "@/utils/handleErrorMessage";
import { SignJWT, decodeJwt, jwtVerify } from "jose";

class Token {
  public ACCESS_TOKEN_NAME: string = "jwt-access-token";
  public REFRESH_TOKEN_NAME: string = "jwt-refresh-token";

  private ACCESS_TOKEN_EXPIRES_IN: string = "10m";
  private TOKEN_NOT_BEFORE: string = "-10s"; // 10 seconds prior to issuing
  private ACCESS_TOKEN_DURATION_MS: number = 1000 * 60 * 10; // 10 minutes
  private REFRESH_TOKEN_DURATION_DEFAULT_MS: number = 1000 * 60 * 60 * 24; // 24 hours

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
      const issuedAt = Date.now();
      const accessTokenExpiration = issuedAt + this.ACCESS_TOKEN_DURATION_MS; // Expires 10 minutes from when it was issued

      // prettier-ignore
      let refreshTokenExpiration = issuedAt + this.REFRESH_TOKEN_DURATION_DEFAULT_MS * 7; // Expires 7 days from when it was isssued

      // If user selected option to be remembered, increase the duration of the tokens
      // Expires 90 days from when it was issued
      if (remember_me) {
        // prettier-ignore
        refreshTokenExpiration = issuedAt + this.REFRESH_TOKEN_DURATION_DEFAULT_MS * 90;
      }

      // Access token and cookie
      const accessToken = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime(this.ACCESS_TOKEN_EXPIRES_IN)
        .setIssuedAt(Math.floor(issuedAt / 1000))
        .setNotBefore(this.TOKEN_NOT_BEFORE)
        .sign(this.encodedAccessTokenSecretKey());

      cookies().set({
        name: this.ACCESS_TOKEN_NAME,
        value: accessToken,
        httpOnly: true,
        expires: accessTokenExpiration,
      });

      // Refresh token and cookie
      const refreshToken = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime(remember_me ? "90d" : "7d")
        .setIssuedAt(Math.floor(issuedAt / 1000))
        .setNotBefore(this.TOKEN_NOT_BEFORE)
        .sign(this.encodedRefreshTokenSecretKey());

      cookies().set({
        name: this.REFRESH_TOKEN_NAME,
        value: refreshToken,
        httpOnly: true,
        expires: refreshTokenExpiration,
      });

      return accessTokenExpiration;
    } catch (error) {
      throw new Error(handleErrorMessage(error));
    }
  }

  /** Verifies the validity of the Access token */
  async verifyToken(token: string | undefined) {
    if (!token) return;

    try {
      const { payload } = await jwtVerify(
        token,
        this.encodedAccessTokenSecretKey()
      );
      return payload;
    } catch (error) {
      console.error(
        `Access Token verification failed: ${handleErrorMessage(error)}`
      );
    }
  }

  /** Verifies the validity of the Refresh token */
  async verifyRefreshToken(token: string | undefined) {
    if (!token) return;

    try {
      const { payload } = await jwtVerify(
        token,
        this.encodedRefreshTokenSecretKey()
      );
      return payload;
    } catch (error) {
      console.error(
        `Refresh Token verification failed: ${handleErrorMessage(error)}`
      );
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

  /** Refreshes the user's current access token to provide continous usage of the app */
  async refreshAccessToken() {
    const refreshToken = cookies().get(this.REFRESH_TOKEN_NAME)?.value;
    if (!refreshToken) throw new Error("Invalid or missing refresh token!");

    const verifiedRefreshToken = await this.verifyRefreshToken(refreshToken);
    if (!verifiedRefreshToken) {
      throw new Error("Provided refresh token is invalid or expired.");
    }

    try {
      const issuedAt = Date.now();
      const refreshedTokenExpiration = issuedAt + this.ACCESS_TOKEN_DURATION_MS; // Expires 10 minutes from when it was issued
      const refreshedToken = await new SignJWT({ ...verifiedRefreshToken })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime(this.ACCESS_TOKEN_EXPIRES_IN)
        .setIssuedAt(Math.floor(issuedAt / 1000))
        .setNotBefore(this.TOKEN_NOT_BEFORE)
        .sign(this.encodedAccessTokenSecretKey());

      cookies().set({
        name: this.ACCESS_TOKEN_NAME,
        value: refreshedToken,
        httpOnly: true,
        expires: refreshedTokenExpiration,
      });

      return refreshedTokenExpiration;
    } catch (error) {
      throw new Error(handleErrorMessage(error));
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
