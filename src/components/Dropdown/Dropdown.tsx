"use client";

import cn from "@/utils/classnames";
import DropdownContext from "./DropdownContext";
import DropdownLabel from "./DropdownLabel";
import DropdownTrigger from "./DropdownTrigger";
import { useState } from "react";
import DropdownBody from "./DropdownBody";
import DropdownItem from "./DropdownItem";

interface DropdownProps {
  children: React.ReactNode;
  handleDropdownSelection: (value: string | number) => void;
  modifierClass?: string;
}

function Dropdown({ children, modifierClass = "" }: DropdownProps) {
  // Control the state of the dropdown menu
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleToggleDropdown = () => setIsOpen(!isOpen);

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        handleToggleDropdown,
      }}
    >
      <div className={cn("relative max-w-lg w-full mb-2", modifierClass)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

Dropdown.Trigger = DropdownTrigger;
Dropdown.Label = DropdownLabel;
Dropdown.Body = DropdownBody;
Dropdown.Item = DropdownItem;

export default Dropdown;
