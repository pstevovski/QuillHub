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
];

export default function TopicsMenu() {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearch = useDebounce(searchValue, 100);

  const TOPICS_LIST = useMemo(() => {
    if (!debouncedSearch) return MOCK_TOPICS;

    const filteredList = matchSorter(MOCK_TOPICS, debouncedSearch, {
      keys: ["name"],
    });

    return filteredList;
  }, [MOCK_TOPICS, debouncedSearch]);

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const typedValue = event.currentTarget.value;

    // Remove empty spaces
    const trimmedSearchValue: string = typedValue.trim();
    setSearchValue(trimmedSearchValue);

    // TODO: Handle selection on "Enter"
    if (event.key === "Enter") {
      // find fully matching item from the filtered list
      const matchingTopic = TOPICS_LIST.find((topic) => {
        return topic.name.toLowerCase() === trimmedSearchValue.toLowerCase();
      });

      if (!matchingTopic) {
        // todo: send API request to create a new topic and select it
      } else {
        handleTopicSelection(matchingTopic);
      }

      // todo: clear out input field
    }
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
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
          onKeyUp={handleSearch}
        />
        <Separator />
        {TOPICS_LIST.length > 0 ? (
          <ul>
            {TOPICS_LIST.map((topic) => (
              <li
                tabIndex={1}
                key={topic.value}
                className={cn(
                  "flex items-center text-slate-400 text-sm p-2 cursor-pointer hover:bg-slate-50 hover:text-slate-500 duration-200",
                  selectedTopics.find(
                    (selectedTopic) => selectedTopic === topic.name
                  )
                    ? "bg-slate-50 text-slate-500"
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
          <h6>No matching Topics found.</h6>
        )}
      </PopoverContent>
    </Popover>
  );
}
