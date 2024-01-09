import { NextRequest, NextResponse } from "next/server";
import { JWT_USER_TOKEN_NAME, verifyToken } from "./utils/jwt";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const authToken = cookies().get(JWT_USER_TOKEN_NAME)?.value || "";

  // Do not take the authenication token into consideration if
  // the user is currently on one of the the authentication pages
  if (request.nextUrl.pathname.startsWith("/auth") && !authToken) return;

  // Verify the token that the user has saved as HttpOnly cookie
  const verifiedToken = await verifyToken(authToken).catch((error) => {
    console.error("Failed verifying access token: ", error.message);
  });

  // If the token has expired then redirect the user back to the signin page
  if (!verifiedToken) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // If everything is fine, allow access to the protected routes
  return NextResponse.next();
}

// todo: set configuration for which routes should the middleware be enabled
export const config = {
  matcher: ["/auth/:path*", "/test"],
};
