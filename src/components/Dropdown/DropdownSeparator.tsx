import cn from "@/utils/classnames";

export default function DropdownSeparator({
  modifierClass = "",
}: {
  modifierClass?: string;
}) {
  return (
    <hr className={cn("max-w-full w-full border-slate-100", modifierClass)} />
  );
}
