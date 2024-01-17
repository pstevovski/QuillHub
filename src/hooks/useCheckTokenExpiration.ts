"use client";

import { handleCheckIfProtectedRoute } from "@/utils/protectedRoutes";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import fetchHandler from "@/utils/fetchHandler";
import handleErrorMessage from "@/utils/handleErrorMessage";

/**
 *
 * Hook that is being called within the `TokenContextProvider`
 * anytime the user is located on a route that is marked as `protected`.
 *
 * When triggered, every 10 seconds the current expiration time for
 * the access token will be checked.
 *
 * If invalid value is provided for the expiration time, sign out the user.
 *
 * Initiates a silent refresh of the access token, 2 minutes before its actual expiration.
 *
 */
export function useCheckTokenExpiration() {
  const pathname = usePathname();

  useEffect(() => {
    // Ignore checking the token expiration value
    if (!handleCheckIfProtectedRoute(pathname)) return;

    handleCheckTokenExpiration();
  }, [pathname]);

  const handleCheckTokenExpiration = async () => {
    setInterval(async () => {
      try {
        const expirationTime = localStorage.getItem("expiresTimestamp");

        // If there's no expiration time value in local storage or its invalid
        // then trigger user logout action
        if (!expirationTime || isNaN(parseInt(expirationTime))) {
          await fetchHandler("POST", "auth/signout", undefined);
          localStorage.removeItem("expiresTimestamp");
          window.location.replace("/auth/signin");
          return;
        }

        // If user's current time is at, or after, the early-expiration time,
        // send a request to the API in order to do "silent" refresh of the token
        const earlyExpirationTime = parseInt(expirationTime) - 1000 * 60 * 2; // 2 minutes earlier
        if (Date.now() >= earlyExpirationTime) {
          const { expiresTime } = await fetchHandler(
            "POST",
            "token/refresh",
            undefined
          );

          // Update the expiration value
          localStorage.setItem("expiresTimestamp", expiresTime);
        }
      } catch (error) {
        toast.error(handleErrorMessage(error));
      }
    }, 10_000);
  };
}
