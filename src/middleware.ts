// NextJS utilities
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

// Services
import TokenService from "./services/token";

export async function middleware(request: NextRequest) {
  const authToken = cookies().get(TokenService.TOKEN_NAME)?.value || "";

  // Do not take the authenication token into consideration if
  // the user is currently on one of the the authentication pages
  if (request.nextUrl.pathname.startsWith("/auth") && !authToken) return;

  // Verify that the token that exists as HttpOnly cookie
  const verifiedToken = await TokenService.verifyToken(authToken).catch(
    (error) => {
      console.error("Failed verifying access token: ", error.message);
    }
  );

  // If the token has expired then redirect the user back to the signin page
  if (!verifiedToken) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // If user tried accessing some of the authentication pages
  // while having a valid token, redirect to default (home) page
  if (request.nextUrl.pathname.startsWith("/auth") && verifiedToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If everything is fine, allow access to the route that the user has requested
  return NextResponse.next();
}

// todo: set configuration for which routes should the middleware be enabled
export const config = {
  matcher: ["/auth/:path*", "/test"],
};
