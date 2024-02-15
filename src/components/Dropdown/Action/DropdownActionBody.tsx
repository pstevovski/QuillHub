import cn from "@/utils/classnames";
import { useDropdownActionContext } from "./DropdownActionContext";

interface DropdownActionBodyProps {
  children: React.ReactNode;
  modifierClass?: string;
}

export default function DropdownActionBody({
  children,
  modifierClass = "",
}: DropdownActionBodyProps) {
  const context = useDropdownActionContext();

  // Do not render any of the child components if the menu is not open
  if (!context.isOpen) return null;

  return (
    <ul
      className={cn(
        "z-50 absolute top-[calc(100%+10px)] left-0 max-w-40 w-full border rounded-md bg-white duration-200",
        modifierClass
      )}
    >
      {children}
    </ul>
  );
}
