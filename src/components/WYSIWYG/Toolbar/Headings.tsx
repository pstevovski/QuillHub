import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";

type Levels = 1 | 2 | 3 | 4 | 5 | 6;
type Headings = `heading-${Levels}`;
type TextType = Headings | "paragraph";

export default function ToolbarHeadings({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const [selectedValue, setSelectedValue] = useState<TextType>("paragraph");
  const handleSelectedValue = (value: TextType) => {
    // Split the received string based on "-", so we can
    // distringuish between headings and paragraph elements
    const splitValue = value.split("-");
    const typeOfSelection: "heading" | "paragraph" = splitValue[1]
      ? "heading"
      : "paragraph";

    if (typeOfSelection === "heading") {
      editor
        .chain()
        .focus()
        .toggleHeading({
          level: parseInt(splitValue[1]) as Levels,
        })
        .run();
    } else {
      editor.chain().focus().setParagraph().run();
    }

    setSelectedValue(value);
  };

  // Reset the type of text to insert (heading or paragraph)
  useEffect(() => {
    if (editor.isActive("heading")) return;
    setSelectedValue("paragraph");
  }, [editor.isActive("heading")]);

  return (
    <>
      <Select
        onValueChange={(value: TextType) => handleSelectedValue(value)}
        defaultValue="paragraph"
        value={selectedValue}
      >
        <SelectTrigger className="max-w-[200px] [&>span>span]:text-lg [&>span>span]:text-slate-500 outline-none focus:ring-0 focus:ring-transparent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value="paragraph"
            className="[&>span>span>svg]:text-slate-400"
          >
            <span className="text-md text-slate-400 font-medium">
              Paragraph
            </span>
          </SelectItem>

          <SelectItem
            value="heading-1"
            className="[&>span>span>svg]:text-slate-400"
          >
            <span className="text-2xl text-slate-400 font-medium">
              Heading 1
            </span>
          </SelectItem>

          <SelectItem
            value="heading-2"
            className="[&>span>span>svg]:text-slate-400"
          >
            <span className="text-xl text-slate-400 font-medium">
              Heading 2
            </span>
          </SelectItem>

          <SelectItem
            value="heading-3"
            className="[&>span>span>svg]:text-slate-400"
          >
            <span className="text-lg text-slate-400 font-medium">
              Heading 3
            </span>
          </SelectItem>

          <SelectItem
            value="heading-4"
            className="[&>span>span>svg]:text-slate-400"
          >
            <span className="text-md text-slate-400 font-medium">
              Heading 4
            </span>
          </SelectItem>

          <SelectItem
            value="heading-5"
            className="[&>span>span>svg]:text-slate-400"
          >
            <span className="text-sm text-slate-400 font-medium">
              Heading 5
            </span>
          </SelectItem>

          <SelectItem
            value="heading-6"
            className="[&>span>span>svg]:text-slate-400"
          >
            <span className="text-xs text-slate-400 font-medium">
              Heading 6
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
