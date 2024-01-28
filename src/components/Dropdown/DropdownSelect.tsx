"use client";

import cn from "@/utils/classnames";
import { createContext, useState } from "react";

interface DropdownSelectPropsContext {
  selectedItem: string | number | null;
  handleToggleSelect: (value: string | number) => void;
}

type DropdownSelectedValue = string | number | null;

interface DropdownSelectProps {
  children: React.ReactNode;
  handleDropdownSelect: (selectedValue: DropdownSelectedValue) => void;
  disabled?: boolean;
  loading?: boolean;
  modifierClass?: string;
}

const DropdownSelectContext = createContext<DropdownSelectPropsContext | null>(
  null
);

export default function DropdownSelect({
  children,
  handleDropdownSelect,
  disabled = false,
  loading = false,
  modifierClass = "",
}: DropdownSelectProps) {
  const [selectedItem, setSelectedItem] = useState<string | number | null>(
    null
  );

  const handleToggleSelect = (value: string | number) => {
    const selectedValue = selectedItem === value ? null : value;
    setSelectedItem(selectedValue);
    handleDropdownSelect(selectedValue);
  };

  return (
    <DropdownSelectContext.Provider
      value={{ selectedItem, handleToggleSelect }}
    >
      <div
        className={cn(
          "relative flex justify-between items-center p-3 mb-2 w-full border rounded-md text-slate-400 cursor-pointer",
          disabled || loading ? "bg-slate-50 cursor-not-allowed" : "",
          modifierClass
        )}
        onClick={handleToggleDropdown}
      >
        {children}

        <div className="flex items-center">
          {loading ? <Loader modifierClass="mr-3" /> : null}
          <ChevronIcon
            className={cn(
              "relative duration-300",
              context.isOpen ? "rotate-180" : ""
            )}
          />
        </div>
      </div>
    </DropdownSelectContext.Provider>
  );
}
