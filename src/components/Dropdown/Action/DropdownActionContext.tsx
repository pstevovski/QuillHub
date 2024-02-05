"use client";

// Hooks
import { createContext, useContext } from "react";

interface DropdownActionContextProps {
  isOpen: boolean;
  handleToggleDropdownMenu: () => void;
}

const DropdownActionContext = createContext<DropdownActionContextProps | null>(
  null
);

export function useDropdownActionContext() {
  const context = useContext(DropdownActionContext);

  if (!context) {
    throw new Error(
      "DropdownAction.* component must be rendered as a child of DropdownAction component."
    );
  }

  return context;
}

export default DropdownActionContext;
