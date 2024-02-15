import cn from "@/utils/classnames";

interface DropdownGroupProps {
  title: string;
  children: React.ReactNode;
  modifierClass?: string;
}

export default function DropdownGroup({
  title,
  children,
  modifierClass = "",
}: DropdownGroupProps) {
  return (
    <li className={cn("w-full p-4 pb-1", modifierClass)}>
      <h5 className="text-sm text-slate-400 font-semibold uppercase">
        {title}
      </h5>
      <ul>{children}</ul>
    </li>
  );
}
