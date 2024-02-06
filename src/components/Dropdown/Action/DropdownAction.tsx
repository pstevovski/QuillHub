"use client";

// Utilities & Hooks
import cn from "@/utils/classnames";
import { useState } from "react";

// Components
import DropdownActionContext from "./DropdownActionContext";
import DropdownActionItem from "./DropdownActionItem";
import DropdownActionBody from "./DropdownActionBody";
import DropdownActionTrigger from "./DropdownActionTrigger";

interface DropdownActionProps {
  children: React.ReactNode;
  modifierClass?: string;
}

function DropdownAction({ children, modifierClass = "" }: DropdownActionProps) {
  // Control the state of the dropdown menu
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <DropdownActionContext.Provider
      value={{
        isOpen,
        handleToggleDropdownMenu: () => setIsOpen(!isOpen),
      }}
    >
      <div className={cn("relative max-w-lg w-full mb-2", modifierClass)}>
        {children}
      </div>
    </DropdownActionContext.Provider>
  );
}

DropdownAction.Trigger = DropdownActionTrigger;
DropdownAction.Body = DropdownActionBody;
DropdownAction.Item = DropdownActionItem;

export default DropdownAction;
