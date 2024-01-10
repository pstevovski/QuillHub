// // Utilities & Hooks
import cn from "@/utils/classnames";
import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormCheckboxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn;
  text: string;
  modifierClass?: string;
}

export default function FormCheckbox({
  text,
  register,
  modifierClass = "",
  ...props
}: FormCheckboxInputProps) {
  return (
    <div
      className={cn("inline-flex items-center", modifierClass)}
      data-tooltip-target="tooltip"
    >
      <label
        className="relative flex items-centerrounded-full cursor-pointer"
        htmlFor="check"
      >
        <input
          type="checkbox"
          className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all hover:bg-slate-50 checked:border-blue-400 checked:bg-blue-400 checked:hover:bg-blue-500 checked:hover:border-blue-500 disabled:bg-slate-100 disabled:border-slate-200 disabled:cursor-not-allowed outline-blue-500 duration-200"
          id="check"
          {...register}
          {...props}
        />

        {/* CHECKMARK ICON */}
        <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-[10px] -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </span>

        <p
          className={cn(
            "ml-2 font-light text-sm text-slate-400 hover:text-slate-500 cursor-pointer select-none duration-200",
            props.disabled ? "text-slate-400" : ""
          )}
        >
          {text}
        </p>
      </label>
    </div>
  );
}
