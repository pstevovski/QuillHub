"use client";

import fetchHandler from "@/utils/fetchHandler";
import { createContext, useEffect } from "react";

const TokenContext = createContext(null);

function TokenContextProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setInterval(async () => {
      const expirationTime = localStorage.getItem("expiresTimestamp");

      // If there's no expiration time value in local storage or its invalid
      // then trigger user logout action
      if (!expirationTime || isNaN(parseInt(expirationTime))) {
        await fetchHandler("POST", "auth/signout", undefined);
        localStorage.removeItem("expiresTimestamp");
        window.location.replace("/auth/signin");
        return;
      }

      const earlyExpirationTime = parseInt(expirationTime) - 1000 * 60 * 2; // 2 minutes earlier

      // If user's current time is at, or after, the early-expiration time,
      // send a request to the API in order to do "silent" refresh of the token
      if (Date.now() >= earlyExpirationTime) {
        const { expiresTime } = await fetchHandler(
          "POST",
          "token/refresh",
          undefined
        );

        // Update the expiration value
        localStorage.setItem("expiresTimestamp", expiresTime);
      }
    }, 1000 * 10);
  }, []);

  return <TokenContext.Provider value={null}>{children}</TokenContext.Provider>;
}

export { TokenContextProvider, TokenContext };
