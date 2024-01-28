"use client";

import { createContext, useContext } from "react";

export interface DropdownPropsContext {
  isOpen: boolean;
  handleToggleDropdown: () => void;
}

const DropdownContext = createContext<DropdownPropsContext | null>(null);

export function useDropdownContext() {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error(
      "Dropdown.* component must be rendered as a child of Dropdown component!"
    );
  }

  return context;
}

export default DropdownContext;
