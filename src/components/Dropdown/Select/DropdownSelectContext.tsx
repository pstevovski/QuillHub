"use client";

// Hooks
import { createContext, useContext } from "react";

// Interfaces
import { DropdownClickedItem, DropdownCommonContextProps } from "../interfaces";

interface DropdownSelectContextProps extends DropdownCommonContextProps {
  selection: DropdownClickedItem[];
  handleSelection: (item: DropdownClickedItem) => void;
}

const DropdownSelectContext = createContext<DropdownSelectContextProps | null>(null);

export function useDropdownSelectContext() {
  const context = useContext(DropdownSelectContext);

  if (!context) {
    throw new Error("Dropdown.Select* component must be rendered as a child of DropdownSelect component.");
  }

  return context;
}

export default DropdownSelectContext;