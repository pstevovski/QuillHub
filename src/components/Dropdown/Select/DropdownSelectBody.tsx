import cn from "@/utils/classnames";
import { useDropdownSelectContext } from "./DropdownSelectContext";

interface DropdownSelectBodyProps {
  children: React.ReactNode;
  modifierClass?: string;
}

export default function DropdownSelectBody({
  children,
  modifierClass = "",
}: DropdownSelectBodyProps) {
  const context = useDropdownSelectContext();

  // Do not render any of the child components if the menu is not open
  if (!context.isOpen) return null;

  return (
    <ul
      className={cn(
        "z-50 absolute top-[calc(100%+10px)] left-0 w-full border rounded-md bg-white",
        modifierClass
      )}
    >
      {children}
    </ul>
  );
}
