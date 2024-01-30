"use client";

import { createContext, useContext } from "react";
import { DropdownSelectedItem } from "./DropdownItem";

export interface DropdownPropsContext {
  isOpen: boolean;
  selection: DropdownSelectedItem[];
  handleToggleDropdown: () => void;
  handleDropdownSelectItem: (selectedItem: DropdownSelectedItem) => void;
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
