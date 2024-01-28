import cn from "@/utils/classnames";
import { useDropdownContext } from "./DropdownContext";

interface DropdownBodyProps {
  children: React.ReactNode;
  modifierClass?: string;
}

export default function DropdownBody({
  children,
  modifierClass = "",
}: DropdownBodyProps) {
  const context = useDropdownContext();

  if (!context.isOpen) return null;

  return (
    <ul
      className={cn(
        "absolute top-[calc(100%+10px)] left-0 w-full border rounded-md bg-white",
        modifierClass
      )}
    >
      {children}
    </ul>
  );
}
