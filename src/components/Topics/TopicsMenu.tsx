"use client";

import { Button } from "@/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { useMemo, useState } from "react";
import { matchSorter } from "match-sorter";

// Icons
import { Check, ChevronDown } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { Separator } from "@/ui/separator";
import { Input } from "@/ui/input";
import cn from "@/utils/classnames";
import { ScrollArea } from "@/ui/scroll-area";

const MOCK_TOPICS = [
  {
    value: "topic-1",
    name: "Topic 1",
  },
  {
    value: "topic-2",
    name: "Topic 2",
  },
  {
    value: "topic-3",
    name: "Topic 3",
  },
  {
    value: "topic-4",
    name: "Topic 4",
  },
  {
    value: "topic-5",
    name: "Topic-5",
  },
  {
    value: "topic-6",
    name: "Topic 6",
  },
  {
    value: "topic-7",
    name: "Topic 7",
  },
];

export default function TopicsMenu() {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearch = useDebounce(searchValue.trim(), 100);

  const TOPICS_LIST = useMemo(() => {
    if (!debouncedSearch) return MOCK_TOPICS;

    const filteredList = matchSorter(MOCK_TOPICS, debouncedSearch, {
      keys: ["name"],
    });

    return filteredList;
  }, [MOCK_TOPICS, debouncedSearch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const typed: string = event.currentTarget.value;
    setSearchValue(typed);
  };

  const handleOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    // Find fully matching item from the filtered list
    const matchingItem = TOPICS_LIST.find((topic) => {
      return topic.name.toLowerCase() === searchValue.toLowerCase();
    });

    // todo: handle sending a request
    if (!matchingItem) return;

    // Select the matching topic
    handleTopicSelection(matchingItem);
  };

  const handleTopicSelection = (selectedTopic: any) => {
    const topicsCopy = [...selectedTopics];

    const selectedTopicIndex = topicsCopy.findIndex(
      (topic) => topic === selectedTopic.name
    );
    if (selectedTopicIndex >= 0) {
      topicsCopy.splice(selectedTopicIndex, 1);
    } else {
      topicsCopy.push(selectedTopic.name);
    }

    setSelectedTopics(topicsCopy);
    setSearchValue("");
  };

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setSearchValue("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between px-2 text-slate-400 text-sm"
        >
          {selectedTopics.length > 0
            ? selectedTopics.join(", ")
            : "Select Topic(s)"}
          <ChevronDown
            className={cn(
              "ml-2 h-4 w-4 shrink-0 opacity-50 duration-200",
              open ? "rotate-180" : ""
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0">
        <Input
          placeholder="Search Topics"
          className="border-none"
          onChange={handleSearch}
          onKeyUp={handleOnEnter}
          value={searchValue}
        />
        <Separator />

        <ScrollArea className="h-[150px]">
          {TOPICS_LIST.length > 0 ? (
            <ul className="px-1">
              {TOPICS_LIST.map((topic) => (
                <li
                  tabIndex={0}
                  key={topic.value}
                  className={cn(
                    "flex items-center text-slate-400 text-sm p-2 my-1 cursor-pointer hover:bg-slate-100 hover:text-slate-500 duration-200 focus:text-slate-900/80 focus:outline-none focus-visible:outline-none",
                    selectedTopics.find(
                      (selectedTopic) => selectedTopic === topic.name
                    )
                      ? "bg-slate-100 text-slate-500"
                      : ""
                  )}
                  onClick={() => handleTopicSelection(topic)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 duration-200",
                      selectedTopics.includes(topic.name)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {topic.name}
                </li>
              ))}
            </ul>
          ) : (
            <h6 className="py-4 text-sm text-slate-400 text-center">
              No matching Topics found.
            </h6>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
