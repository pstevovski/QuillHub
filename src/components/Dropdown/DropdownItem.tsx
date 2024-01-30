import cn from "@/utils/classnames";
import { useDropdownContext } from "./DropdownContext";
import { useRef } from "react";

export interface DropdownItemProps {
  children: React.ReactNode;
  value: string | number | boolean;
  disabled?: boolean;
  modifierClass?: string;
}

export interface DropdownSelectedItem {
  text: string;
  value: string | number | boolean;
}

export default function DropdownItem({
  children,
  value,
  disabled = false,
  modifierClass = "",
}: DropdownItemProps) {
  const context = useDropdownContext();
  const dropdownItemRef = useRef<HTMLLIElement | null>(null);

  const handleItemSelection = () => {
    if (disabled) return;

    if (!dropdownItemRef || !dropdownItemRef.current) return;

    if (dropdownItemRef.current.textContent == null) return;

    context.handleDropdownSelectItem({
      text: dropdownItemRef.current.textContent,
      value,
    });
  };

  return (
    <li
      ref={dropdownItemRef}
      key={String(value)}
      className={cn(
        "relative w-full p-3 text-slate-400 bg-white text-sm first-of-type:rounded-t-md last-of-type:rounded-b-md hover:text-teal-500 hover:bg-slate-50 duration-300 cursor-pointer",
        disabled
          ? "bg-slate-100 opacity-50 hover:bg-slate-100 hover:text-slate-400 cursor-not-allowed"
          : "",
        context.selection.some((selectedItem) => selectedItem.value === value)
          ? "text-teal-400 bg-slate-50"
          : "",
        modifierClass
      )}
      onClick={handleItemSelection}
    >
      {children}
    </li>
  );
}
