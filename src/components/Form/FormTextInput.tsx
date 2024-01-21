// Utilities & Hooks
import cn from "@/utils/classnames";
import { InputHTMLAttributes } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormTextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn;
  error: FieldError | undefined;
  label?: string;
  modifierClass?: string;
}

export default function FormTextInput({
  register,
  label = "",
  modifierClass = "",
  error = undefined,
  ...props
}: FormTextInputProps) {
  return (
    <div className={cn("relative", modifierClass)}>
      {label ? (
        <label className="block text-slate-400 text-sm mb-2" htmlFor={props.id}>
          {label}
        </label>
      ) : null}

      <input
        type="text"
        className={cn(
          "text-sm w-full border p-3 rounded-md mb-10 focus:outline-none placeholder:text-slate-300 transition-[border-color]",
          error ? "text-red-600 border-red-500" : ""
        )}
        {...register}
        {...props}
      />

      {error ? (
        <p className="absolute left-0 bottom-4 text-xs font-medium text-red-600">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}
