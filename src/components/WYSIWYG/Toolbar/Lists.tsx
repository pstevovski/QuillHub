import { Toggle } from "@/ui/toggle";
import { List, ListOrdered } from "lucide-react";
import { TipTapExtensionComponentProps } from "../TipTap";

export default function Lists({ editor }: TipTapExtensionComponentProps) {
  return (
    <>
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
      >
        <List className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => {
          editor.chain().focus().toggleOrderedList().run();
        }}
      >
        <ListOrdered className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
    </>
  );
}
