import cn from "@/utils/classnames";

// Assets
import { HiDotsVertical as TriggerDots } from "react-icons/hi";

import Loader from "@/components/Loaders/Loader";
import { useDropdownActionContext } from "./DropdownActionContext";

interface DropdownActionTriggerProps {
  triggerContent?: React.ReactNode;
  loading: boolean;
  disabled: boolean;
  modifierClass?: string;
}

export default function DropdownActionTrigger({
  triggerContent,
  loading = false,
  disabled = false,
  modifierClass = "",
}: DropdownActionTriggerProps) {
  const context = useDropdownActionContext();

  const handleToggleDropdown = () => {
    if (loading || disabled) return;
    context.handleToggleDropdownMenu();
  };

  return (
    <div
      className={cn(
        "relative flex justify-between items-center p-3 mb-2 max-w-[40px] w-full border rounded-md text-slate-400 cursor-pointer hover:bg-slate-50 duration-200",
        disabled || loading ? "bg-slate-50 cursor-not-allowed" : "",
        context.isOpen ? "bg-slate-50" : "",
        modifierClass
      )}
      onClick={handleToggleDropdown}
    >
      <span className="flex items-center text-sm text-slate-400">
        {loading ? <Loader /> : triggerContent || <TriggerDots />}
      </span>
    </div>
  );
}
