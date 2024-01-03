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
    <div>
      {label ? <label htmlFor={props.id}>{label}</label> : null}

      <input
        type="text"
        className={cn(
          "text-sm w-full border p-2 rounded mb-5 focus:outline-none placeholder:text-slate-300 transition-[border-color]",
          error ? "border-red-500 mb-0" : "",
          modifierClass
        )}
        {...register}
        {...props}
      />

      {error ? (
        <p className="text-sm text-red-500 mb-2">{error.message}</p>
      ) : null}
    </div>
  );
}
