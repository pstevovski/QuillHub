import cn from "@/utils/classnames";

interface DropdownLabelProps {
  children: React.ReactNode;
  modifierClass?: string;
}

export default function DropdownLabel({
  children,
  modifierClass = "",
}: DropdownLabelProps) {
  return (
    <div
      className={cn(
        "relative w-full bg-red-200 text-slate-400 text-sm mb-2",
        modifierClass
      )}
    >
      {children}
    </div>
  );
}
