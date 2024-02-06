"use client";

// Utilities & Hooks
import cn from "@/utils/classnames";
import { useState } from "react";

// Components
import DropdownSelectContext from "./DropdownSelectContext";
import DropdownSelectBody from "./DropdownSelectBody";
import DropdownSelectItem, {
  type DropdownSelectClickedItem,
} from "./DropdownSelectItem";
import DropdownSelectTrigger from "./DropdownSelectTrigger";
import DropdownSelectSearch from "./DropdownSelectSearch";

interface DropdownSelectProps {
  children: React.ReactNode;
  selection: DropdownSelectClickedItem[];
  modifierClass?: string;
  handleSelection: (selection: DropdownSelectClickedItem) => void;
}

function DropdownSelect({
  children,
  selection = [],
  handleSelection,
  modifierClass = "",
}: DropdownSelectProps) {
  // Control the state of the dropdown menu
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <DropdownSelectContext.Provider
      value={{
        isOpen,
        selection,
        handleSelection,
        handleToggleDropdownMenu: () => setIsOpen(!isOpen),
      }}
    >
      <div className={cn("relative max-w-lg w-full mb-2", modifierClass)}>
        {children}
      </div>
    </DropdownSelectContext.Provider>
  );
}

DropdownSelect.Trigger = DropdownSelectTrigger;
DropdownSelect.Body = DropdownSelectBody;
DropdownSelect.Item = DropdownSelectItem;
DropdownSelect.Search = DropdownSelectSearch;

export default DropdownSelect;
