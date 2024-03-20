"use client";

import cn from "@/utils/classnames";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

// TODO: WIP
function Pagination() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(3);

  // todo: handle page selection and search parameter updating
  const handlePaginationParams = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (page - 1).toString());

    if (!page) {
      params.delete("page");
    }

    setCurrentPage(page);
    router.push(`${pathname}?${params}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex justify-center items-center size-12 border rounded-md bg-white text-slate-400 cursor-pointer">
        Prev
      </div>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <div
          key={`page-${page}`}
          className={cn(
            "flex justify-center items-center size-12 border rounded-md bg-white text-slate-400 cursor-pointer",
            currentPage === page ? "text-slate-600 bg-slate-400" : ""
          )}
          onClick={() => handlePaginationParams(page)}
        >
          {page}
        </div>
      ))}

      <div className="flex justify-center items-center size-12 border rounded-md bg-white text-slate-400 cursor-pointer">
        Next
      </div>
    </div>
  );
}

export default Pagination;
