import cn from "@/utils/classnames";

// Assets
import { FaChevronDown as ChevronIcon } from "react-icons/fa";
import { useDropdownSelectContext } from "./DropdownSelectContext";
import Loader from "@/components/Loaders/Loader";

interface DropdownSelectTriggerProps {
  loading: boolean;
  disabled: boolean;
  placeholderText: string;
  modifierClass?: string;
}

export default function DropdownSelectTrigger({
  placeholderText = "",
  loading = false,
  disabled = false,
  modifierClass = "",
}: DropdownSelectTriggerProps) {
  const context = useDropdownSelectContext();

  const handleToggleDropdown = () => {
    if (loading || disabled) return;
    context.handleToggleDropdownMenu();
  };

  return (
    <div
      className={cn(
        "relative flex justify-between items-center p-3 mb-2 w-full border rounded-md text-slate-400 cursor-pointer",
        disabled || loading ? "bg-slate-50 cursor-not-allowed" : "",
        modifierClass
      )}
      onClick={handleToggleDropdown}
    >
      <span className="text-sm text-slate-400">
        {context.selection && context.selection.length > 0
          ? context.selection
              .map((selectedItem) => selectedItem.text)
              .join(", ")
          : placeholderText}
      </span>

      <div className="flex items-center">
        {loading ? <Loader modifierClass="mr-3" /> : null}
        <ChevronIcon
          className={cn(
            "relative duration-300",
            context.isOpen ? "rotate-180" : ""
          )}
        />
      </div>
    </div>
  );
}
