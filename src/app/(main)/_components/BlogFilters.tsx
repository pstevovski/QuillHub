"use client";

import { User } from "@/db/schema/users";
import cn from "@/utils/classnames";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export type BlogFilter =
  | "trending"
  | "top_rated"
  | "new"
  | "bookmarked"
  | "for_you";

interface BlogSections {
  name: BlogFilter;
  title: string;
}

const BLOG_SECTIONS: BlogSections[] = [
  {
    name: "trending",
    title: "Trending",
  },
  {
    name: "top_rated",
    title: "Top Rated",
  },
  {
    name: "new",
    title: "New",
  },
  {
    name: "bookmarked",
    title: "Bookmarked",
  },
  {
    name: "for_you",
    title: "For You",
  },
];

export default function HomepageBlogFilters({ user }: { user: User | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedFilter, setSelectedFilter] = useState<BlogFilter>(() => {
    // Pre-select the existing search parameter filter or use default one
    return (searchParams.get("filter") as BlogFilter | undefined) || "trending";
  });

  // Update the currently selected blogs filtering option and update search parameters
  const handleSelectBlogsFilter = (filter: BlogFilter) => {
    setSelectedFilter(filter);

    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", filter);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <section
      className={cn(
        "px-24 mx-auto duration-300",
        user ? "max-w-screen-xl" : "max-w-screen-md"
      )}
    >
      <ul className="flex items-center justify-center gap-x-20">
        {BLOG_SECTIONS.filter((section) => {
          return !user
            ? !["bookmarked", "for_you"].includes(section.name)
            : section;
        }).map((section) => (
          <li
            key={section.name}
            className={cn(
              "p-3 text-slate-400 hover:text-teal-500 duration-300 cursor-pointer",
              section.name === selectedFilter ? "text-teal-500" : ""
            )}
            onClick={() => handleSelectBlogsFilter(section.name)}
          >
            {section.title}
          </li>
        ))}
      </ul>
      <hr className="border-none h-[1px] bg-gradient-to-r from-white via-slate-200 to-white" />
    </section>
  );
}
