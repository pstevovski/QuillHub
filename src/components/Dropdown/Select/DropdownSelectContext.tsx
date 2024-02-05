"use client";

// Hooks
import { createContext, useContext } from "react";

// Interfaces
import { DropdownSelectClickedItem } from "./DropdownSelectItem";

interface DropdownSelectContextProps {
  isOpen: boolean;
  selection: DropdownSelectClickedItem[];
  handleToggleDropdownMenu: () => void;
  handleSelection: (selectedItem: DropdownSelectClickedItem) => void;
}

const DropdownSelectContext = createContext<DropdownSelectContextProps | null>(
  null
);

export function useDropdownSelectContext() {
  const context = useContext(DropdownSelectContext);

  if (!context) {
    throw new Error(
      "Dropdown.Select* component must be rendered as a child of DropdownSelect component."
    );
  }

  return context;
}

export default DropdownSelectContext;
