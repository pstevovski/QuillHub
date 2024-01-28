import cn from "@/utils/classnames";
import { useDropdownContext } from "./DropdownContext";

export interface DropdownItemProps {
  children: React.ReactNode;
  text: string;
  value: string | number;
  disabled?: boolean;
  modifierClass?: string;
}

export default function DropdownItem({
  children,
  value,
  disabled = false,
  modifierClass = "",
}: DropdownItemProps) {
  const context = useDropdownContext();

  const handleItemSelection = () => {
    if (disabled) return;
    context.handleItemSelection(value);
  };

  return (
    <li
      key={value}
      className={cn(
        "relative w-full p-3 text-slate-400 bg-white text-sm first-of-type:rounded-t-md last-of-type:rounded-b-md hover:text-teal-500 hover:bg-slate-50 duration-300 cursor-pointer",
        disabled
          ? "bg-slate-100 opacity-50 hover:bg-slate-100 hover:text-slate-400 cursor-not-allowed"
          : "",
        modifierClass
      )}
      onClick={handleItemSelection}
    >
      {children}
    </li>
  );
}
