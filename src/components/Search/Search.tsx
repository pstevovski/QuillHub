"use client";

import useDebounce from "@/hooks/useDebounce";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Search({ label }: { label?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searched, setSearched] = useState<string>("");
  const debouncedSearch = useDebounce(searched);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearched(event.target.value);
  };

  useEffect(() => {
    handleCreatingQueryStrings(debouncedSearch);
  }, [debouncedSearch]);

  const handleCreatingQueryStrings = (debouncedSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", debouncedSearch);

    if (!debouncedSearch) {
      params.delete("search");
    }

    router.push(`${pathname}?${params}`, { scroll: false });
  };

  return (
    <div className="w-full">
      {label ? <Label htmlFor="search-field">Search</Label> : null}
      <Input
        id="search-field"
        placeholder="Search..."
        onChange={handleSearch}
        className="placeholder:text-slate-400 placeholder:italic"
      />
    </div>
  );
}
