import cn from "@/utils/classnames";
import { ButtonHTMLAttributes } from "react";
import Loader from "../Loaders/Loader";

type Size = "sm" | "md" | "lg" | "xl" | "full";
type Variant = "primary" | "secondary" | "disabled" | "danger" | "success";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;

  size?: Size;
  variant?: Variant;
  modifierClass?: string;
  isLoading?: boolean;
  handleOnClick?: () => void;
}

const Variants: Record<Variant, string> = {
  primary: "bg-teal-400 hover:bg-teal-500",
  secondary: "bg-orange-400 hover:bg-orange-500",
  disabled:
    "text-slate-600 bg-slate-100 hover:bg-slate-200 hover:cursor-not-allowed",
  danger: "bg-red-500 hover:bg-red-600",
  success: "bg-emerald-400 hover:bg-emerald-500",
};

const Sizes: Record<Size, string> = {
  sm: "w-32",
  md: "w-48",
  lg: "w-72",
  xl: "w-80",
  full: "w-full",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  modifierClass = "",
  isLoading = false,
  handleOnClick,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "flex justify-center items-center p-2 w-full rounded duration-200 text-white",
        Variants[props.disabled || isLoading ? "disabled" : variant],
        Sizes[size],
        modifierClass
      )}
      onClick={handleOnClick}
      {...props}
    >
      {children}

      {isLoading ? <Loader modifierClass="ml-2" /> : null}
    </button>
  );
}
