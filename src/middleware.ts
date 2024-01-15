// NextJS utilities
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Services
import TokenService from "./services/token";
import { handleCheckIfProtectedRoute } from "./utils/protectedRoutes";

// Do not invoke the middleware function on NextJS and items served from "public" (e.g. favicon)
// On all other defined routes the middleware should be triggered
export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};

export async function middleware(request: NextRequest) {
  // Verify the token that the user sent in the request
  const hasValidToken = await TokenService.verifyToken();

  // If user does not have a valid token and tried accessing proected route
  // then either redirect to signin page or show JSON message if requested route was API endpoint
  const isProtectedRoute: boolean = handleCheckIfProtectedRoute(request);
  if (!hasValidToken && isProtectedRoute) {
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json(
        { message: "You are not authenticated", status: 401 },
        { status: 401 }
      );
    } else {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // Redirect the user to the home page when trying to access Authentication pages with valid token
  if (request.nextUrl.pathname.startsWith("/auth") && hasValidToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
