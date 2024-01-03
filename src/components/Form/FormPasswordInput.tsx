"use client";

// Utilities & Hooks
import cn from "@/utils/classnames";
import { InputHTMLAttributes, useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

// Assets
import {
  MdVisibility as PasswordShow,
  MdVisibilityOff as PasswordHide,
} from "react-icons/md";

interface FormPasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn;
  error: FieldError | undefined;
  label?: string;
  modifierClass?: string;
}

export default function FormPasswordInput({
  register,
  label = "",
  modifierClass = "",
  error = undefined,
  ...props
}: FormPasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <div>
      {label ? <label htmlFor={props.id}>{label}</label> : null}

      <div className="relative">
        <input
          type={isPasswordVisible ? "text" : "password"}
          className={cn(
            "text-sm w-full border p-2 rounded mb-5 focus:outline-none placeholder:text-slate-300 transition-[border-color]",
            error ? "border-red-500 mb-0" : "",
            modifierClass
          )}
          placeholder="**********"
          {...register}
          {...props}
        />

        <div
          className="absolute right-5 top-2 text-2xl text-slate-300 cursor-pointer hover:text-slate-400 duration-200"
          onClickCapture={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? <PasswordShow /> : <PasswordHide />}
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-500 mb-2">{error.message}</p>
      ) : null}
    </div>
  );
}
