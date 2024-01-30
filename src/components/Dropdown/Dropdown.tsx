"use client";

import cn from "@/utils/classnames";
import DropdownContext from "./DropdownContext";
import DropdownLabel from "./DropdownLabel";
import DropdownTrigger from "./DropdownTrigger";
import { useState } from "react";
import DropdownBody from "./DropdownBody";
import DropdownItem, { DropdownSelectedItem } from "./DropdownItem";

interface DropdownProps {
  children: React.ReactNode;
  type: "single-select" | "multi-select";
  handleDropdownSelection: (selection: DropdownSelectedItem[]) => void;
  modifierClass?: string;
}

function Dropdown({
  children,
  type = "single-select",
  handleDropdownSelection,
  modifierClass = "",
}: DropdownProps) {
  // Control the state of the dropdown menu
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleToggleDropdown = () => setIsOpen(!isOpen);

  // Control the currently selected item
  const [selection, setSelection] = useState<DropdownSelectedItem[]>([]);
  const handleDropdownSelectItem = (selectedItem: DropdownSelectedItem) => {
    if (type === "single-select") {
      setSelection([selectedItem]);
      handleDropdownSelection([selectedItem]);
    }

    if (type === "multi-select") {
      const selectionCopy = [...selection];
      const selectedItemIndex = selectionCopy.findIndex(
        (item) => item.value === selectedItem.value
      );

      if (selectedItemIndex >= 0) {
        selectionCopy.splice(selectedItemIndex, 1);
      } else {
        selectionCopy.push(selectedItem);
      }

      setSelection(selectionCopy);
      handleDropdownSelection(selectionCopy);
    }
  };

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        selection,
        handleToggleDropdown,
        handleDropdownSelectItem,
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
