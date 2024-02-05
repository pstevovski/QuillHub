import cn from "@/utils/classnames";
import { useRef } from "react";

interface DropdownActionItemProps {
  children: React.ReactNode;
  value: string | number | boolean;
  disabled?: boolean;
  loading?: boolean;
  modifierClass?: string;
  handleClickedActionItem: (item: DropdownActionClickedItem) => void;
}

interface DropdownActionClickedItem {
  text: string;
  value: unknown;
}

export default function DropdownActionItem({
  children,
  value,
  disabled = false,
  loading = false,
  modifierClass = "",
  handleClickedActionItem,
}: DropdownActionItemProps) {
  const dropdownItemRef = useRef<HTMLLIElement | null>(null);

  const handleAction = () => {
    if (disabled || loading) return;

    if (!dropdownItemRef || !dropdownItemRef.current) return;

    if (dropdownItemRef.current.textContent == null) return;

    handleClickedActionItem({
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
        disabled || loading
          ? "bg-slate-100 opacity-50 hover:bg-slate-100 hover:text-slate-400 cursor-not-allowed"
          : "",
        modifierClass
      )}
      onClick={handleAction}
    >
      {children}
    </li>
  );
}
