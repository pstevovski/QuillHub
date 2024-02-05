"use client";

import cn from "@/utils/classnames";
import { useState } from "react";
import { DropdownClickedItem } from "../interfaces";
import DropdownSelectContext from "./DropdownSelectContext";
import DropdownTrigger from "../DropdownTrigger";
import DropdownLabel from "../DropdownLabel";
import DropdownBody from "../DropdownBody";
import DropdownSelectItem from "./DropdownSelectItem";

interface DropdownSelectProps {
  children: React.ReactNode;
  selection: DropdownClickedItem[];
  modifierClass?: string;
  handleSelection: (selection: DropdownClickedItem) => void;
}

function Dropdown({
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

Dropdown.Trigger = DropdownTrigger;
Dropdown.Label = DropdownLabel;
Dropdown.Body = DropdownBody;
Dropdown.Item = DropdownSelectItem;

export default Dropdown;
