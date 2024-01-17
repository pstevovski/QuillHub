"use client";

import { useCheckTokenExpiration } from "@/hooks/useCheckTokenExpiration";
import { createContext } from "react";

const TokenContext = createContext(null);

function TokenContextProvider({ children }: { children: React.ReactNode }) {
  useCheckTokenExpiration();

  return <TokenContext.Provider value={null}>{children}</TokenContext.Provider>;
}

export { TokenContextProvider, TokenContext };
