import cn from "@/utils/classnames";
import { FieldError } from "react-hook-form";

interface FormFieldErrorMessageProps {
  error: FieldError | undefined;
  modifierClass?: string;
}

export default function FormFieldErrorMessage({
  error = undefined,
  modifierClass = "",
}: FormFieldErrorMessageProps) {
  if (!error) return null;

  return (
    <p className={cn("text-xs font-medium text-red-600 mb-2", modifierClass)}>
      {error.message}
    </p>
  );
}
