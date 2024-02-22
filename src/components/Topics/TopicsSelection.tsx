"use client";

import { useMemo, useRef, useState } from "react";
import { matchSorter } from "match-sorter";

// Icons
import { Search, XCircle } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { Input } from "@/ui/input";
import cn from "@/utils/classnames";
import { toast } from "sonner";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { useTopicsCreate, useTopicsGetAll } from "@/app/api/topics/query-hooks";
import Loader from "../Loaders/Loader";
import { Badge } from "@/ui/badge";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { Topic } from "@/db/schema/topics";

interface TopicsMenuProps {
  selectionLimit?: number;
  modifierClass?: string;
  handleSelectedTopics: (selectedTopics: Topic[]) => void;
}

export default function TopicsSelection({
  selectionLimit = 3,
  modifierClass = "",
  handleSelectedTopics,
}: TopicsMenuProps) {
  const [open, setOpen] = useState<boolean>(false);
  const topicsMenuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(topicsMenuRef, () => setOpen(false));

  /*========================================
    FETCH THE LIST OF TOPICS
  =========================================*/
  const { data: topicsData, isLoading: topicsLoading } = useTopicsGetAll();

  /*========================================
    CREATE A NEW TOPIC
  =========================================*/
  const createTopic = useTopicsCreate();

  const handleTopicCreate = async () => {
    try {
      const newTopic = await createTopic.mutateAsync(debouncedSearch);
      handleTopicSelection(newTopic);
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
  };

  /*========================================
    SEARCH AND SELECT TOPICS
  =========================================*/
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearch = useDebounce(searchValue.trim(), 100);

  const TOPICS_LIST = useMemo(() => {
    if (!topicsData || topicsLoading) return [];

    let topics = [...topicsData];

    // Filter out the selected topics
    topics = topics.filter((topic) => {
      return !selectedTopics.some((selectedTopic) => {
        return topic.name.toLowerCase() === selectedTopic.name.toLowerCase();
      });
    });

    if (debouncedSearch) {
      topics = matchSorter(topics, debouncedSearch, {
        keys: ["name"],
        threshold: matchSorter.rankings.WORD_STARTS_WITH,
      });
    }

    return topics;
  }, [topicsData, selectedTopics, debouncedSearch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const typed: string = event.currentTarget.value;
    setSearchValue(typed);
  };

  const handleOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || createTopic.isPending) return;

    const matchingTopics = matchSorter(TOPICS_LIST, searchValue.toLowerCase(), {
      keys: ["name"],
      threshold: matchSorter.rankings.WORD_STARTS_WITH,
    });

    // Select the matching topic or send a request to create a new one
    if (matchingTopics.length > 0) {
      handleTopicSelection(matchingTopics[0]);
    } else {
      handleTopicCreate();
    }
  };

  const handleTopicSelection = (targetedTopic: Topic) => {
    // If limit is reached, prevent interactions
    if (selectedTopics.length >= selectionLimit) return;

    const updatedSelection = [...selectedTopics];
    const topicIndex = updatedSelection.findIndex(
      (topic) => topic.name === targetedTopic.name
    );

    // Either add or remove the topic from the selection
    if (topicIndex >= 0) {
      updatedSelection.splice(topicIndex, 1);
    } else {
      updatedSelection.push(targetedTopic);
    }

    // Update the selection, clear out input and close the menu
    setSelectedTopics(updatedSelection);
    setSearchValue("");
    setOpen(false);

    // Trigger selection callback
    handleSelectedTopics(updatedSelection);
  };

  const handleTopicDeselection = (topic: Topic) => {
    const updatedSelection = [...selectedTopics];
    const index = updatedSelection.findIndex(
      (selection) => selection.name.toLowerCase() === topic.name.toLowerCase()
    );

    if (index >= 0) updatedSelection.splice(index, 1);

    setSelectedTopics(updatedSelection);

    // Trigger selection callback
    handleSelectedTopics(updatedSelection);
  };

  return (
    <div
      className={cn("inline-block relative", modifierClass)}
      ref={topicsMenuRef}
    >
      <div className="relative">
        <Search className="size-[18px] text-slate-400 absolute top-1/2 -translate-y-1/2 left-2" />
        <Input
          className="max-w-md pl-8 text-slate-400 disabled:bg-slate-50"
          placeholder={topicsLoading ? "Loading Topics..." : "Search Topics..."}
          onChange={handleSearch}
          onKeyUp={handleOnEnter}
          value={searchValue}
          onClick={() => setOpen(!open)}
          disabled={selectedTopics.length >= selectionLimit || topicsLoading}
        />
      </div>

      <span className="text-slate-400 text-xs">
        Type the name of the topic in the search box. If what you're looking for
        doesn't exist, press "Enter" to create it.
      </span>

      {/* TOPICS CONTENT */}
      {open || searchValue ? (
        <ul className="absolute z-10 top-[50px] max-w-md w-full max-h-[250px] mb-6 p-2 overflow-y-auto bg-white rounded shadow-sm border">
          {TOPICS_LIST.length > 0 ? (
            TOPICS_LIST.map((topic) => (
              <li
                tabIndex={0}
                key={topic.slug}
                className={cn(
                  "flex items-center text-slate-400 text-sm p-2 my-1 cursor-pointer hover:bg-slate-100 hover:text-slate-500 duration-200 focus:text-slate-900/80 focus:outline-none focus-visible:outline-none"
                )}
                onClick={() => handleTopicSelection(topic)}
              >
                {topic.name}
              </li>
            ))
          ) : (
            <div className="flex justify-between items-center p-2">
              <h6 className="text-slate-400 text-sm">
                Topic not found. Press{" "}
                <span className="text-teal-500 font-medium">"Enter"</span> to
                create it.
              </h6>
              {createTopic.isPending ? <Loader /> : null}
            </div>
          )}
        </ul>
      ) : null}

      {/* BADGES OF SELECTED TOPICS */}
      {selectedTopics.length > 0 ? (
        <div className="max-w-md w-full flex flex-wrap space-x-1 mt-4">
          {selectedTopics.map((topic) => (
            <Badge
              key={topic.slug}
              variant="secondary"
              className="text-slate-500 mb-3"
            >
              {topic.name}
              <XCircle
                className="size-[16px] text-slate-400 ml-2 cursor-pointer hover:text-red-400 duration-200"
                onClick={() => handleTopicDeselection(topic)}
              />
            </Badge>
          ))}
        </div>
      ) : null}

      {/* MAXIMUM ALLOWED SELECTION LIMIT */}
      {selectedTopics.length >= selectionLimit ? (
        <span className="inline-block font-medium text-red-400 text-xs mb-4">
          You can select up to {selectionLimit} topics.
        </span>
      ) : null}
    </div>
  );
}
