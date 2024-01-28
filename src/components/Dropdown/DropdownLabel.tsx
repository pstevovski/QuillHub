import cn from "@/utils/classnames";

interface DropdownLabelProps {
  children: React.ReactNode;
  modifierClass?: string;
}

export default function DropdownLabel({
  children,
  modifierClass = "",
}: DropdownLabelProps) {
  return <div className={cn("relative w-full", modifierClass)}>{children}</div>;
}
