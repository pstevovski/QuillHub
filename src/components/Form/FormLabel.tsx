import cn from "@/utils/classnames";

interface FormLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  modifierClass?: string;
}

export default function FormLabel({
  children,
  htmlFor,
  modifierClass = "",
}: FormLabelProps) {
  return (
    <label
      className={cn("inline-block text-slate-400 text-sm mb-2", modifierClass)}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}
