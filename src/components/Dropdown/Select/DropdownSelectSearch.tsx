"use client";

import useDebounce from "@/hooks/useDebounce";
import cn from "@/utils/classnames";
import { useEffect, useState } from "react";

// Assets
import { FaSearch as SearchIcon } from "react-icons/fa";

interface DropdownSelectSearchProps {
  handleSearch: (searchedValue: string) => void;
  placeholder?: string;
  showIcon?: boolean;
  modifierClass?: string;
  searchDebounce?: number;
}

export default function DropdownSelectSearch({
  handleSearch,
  placeholder = "Search...",
  showIcon = true,
  modifierClass = "",
  searchDebounce = 500,
}: DropdownSelectSearchProps) {
  const [searchedValue, setSearchedValue] = useState<string>("");
  const debouncedSearch = useDebounce<string>(searchedValue, searchDebounce);

  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className={cn("relative p-2", modifierClass)}>
      {showIcon ? (
        <SearchIcon className="absolute left-6 text-lg text-slate-200 top-1/2 -translate-y-1/2" />
      ) : null}
      <input
        type="text"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchedValue(event.currentTarget.value);
        }}
        className={cn(
          "text-sm w-full border p-3 rounded-md text-slate-500 focus:outline-none placeholder:text-slate-300 transition-[border-color]",
          showIcon ? "pl-10" : ""
        )}
        placeholder={placeholder}
      />
    </div>
  );
}
