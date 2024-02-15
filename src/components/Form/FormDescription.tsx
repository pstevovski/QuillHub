import cn from "@/utils/classnames";

interface FormDescriptionProps {
  children: React.ReactNode;
  modifierClass?: string;
}

export default function FormDescription({
  children,
  modifierClass = "",
}: FormDescriptionProps) {
  return (
    <div
      className={cn("relative text-sm text-slate-400 w-full", modifierClass)}
    >
      {children}
    </div>
  );
}
