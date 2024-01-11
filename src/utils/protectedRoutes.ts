import type { NextRequest } from "next/server";

const PROTECTED_ROUTES: string[] = ["/protected"];

/**
 * Utility function that checks if the route that
 * the user tried accessing is part of the protected routes list.
 *
 * This list is consisted of routes that represent either "pages" or "API endpoints".
 *
 * Anytime a new route is added to the application, if we want to protect it
 * by requiring the user to be signed in and have a valid token, we need to
 * add it to the list of `PROTECTED_ROUTES` constant.
 *
 * */
export function handleCheckIfProtectedRoute(request: NextRequest): boolean {
  return PROTECTED_ROUTES.some((route) => {
    return request.nextUrl.pathname.startsWith(route);
  });
}
