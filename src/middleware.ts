// NextJS utilities
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

// Services
import TokenService from "./services/token";
import { handleCheckIfProtectedRoute } from "./utils/protectedRoutes";
import fetchHandler from "./utils/fetchHandler";

// Do not invoke the middleware function on NextJS and items served from "public" (e.g. favicon)
// On all other defined routes the middleware should be triggered
export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};

export async function middleware(request: NextRequest) {
  const accessToken = cookies().get(TokenService.ACCESS_TOKEN_NAME)?.value;
  const refreshToken = request.cookies.get(
    TokenService.REFRESH_TOKEN_NAME
  )?.value;

  // Issue a new access token before accessing the resource, if the previous one expired
  if (refreshToken && !accessToken) {
    const { token, expires } = await fetchHandler("POST", "token/refresh", {
      refreshToken,
    });

    // Append the newly issued access token as a cookie before
    // sending back the response from the middleware
    const response = NextResponse.next();
    response.cookies.set(TokenService.ACCESS_TOKEN_NAME, token, {
      httpOnly: true,
      expires,
      sameSite: "lax",
      secure: true,
    });

    return response;
  }

  // Verify the token that the user sent in the request
  const hasValidAccessToken = await TokenService.verifyToken(accessToken).catch(
    (error) => console.error("Failed verifying access token: ", error.message)
  );

  // If user does not have a valid token and tried accessing proected route
  // then either redirect to signin page or show JSON message if requested route was API endpoint
  const isProtectedRoute: boolean = handleCheckIfProtectedRoute(
    request.nextUrl.pathname
  );
  if (!hasValidAccessToken && isProtectedRoute) {
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json(
        { message: "You are not authenticated", status: 401 },
        { status: 401 }
      );
    } else {
      // Redirect the user back to the homepage,
      // open the authentication modal and include redirect url
      request.nextUrl.searchParams.set("modal", "sign_in");
      request.nextUrl.searchParams.set("redirectUrl", request.nextUrl.pathname);
      return NextResponse.redirect(
        new URL(`/${request.nextUrl.search}`, request.url)
      );
    }
  }
}
