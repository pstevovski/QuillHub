import { Toggle } from "@/ui/toggle";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { TipTapExtensionComponentProps } from "../TipTap";

export default function TextAlignment({
  editor,
}: TipTapExtensionComponentProps) {
  return (
    <>
      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "left" })}
        onPressedChange={() => {
          editor.chain().focus().setTextAlign("left").run();
        }}
      >
        <AlignLeft className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "center" })}
        onPressedChange={() => {
          editor.chain().focus().setTextAlign("center").run();
        }}
      >
        <AlignCenter className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "right" })}
        onPressedChange={() => {
          editor.chain().focus().setTextAlign("right").run();
        }}
      >
        <AlignRight className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive({ textAlign: "justify" })}
        onPressedChange={() => {
          editor.chain().focus().setTextAlign("justify").run();
        }}
      >
        <AlignJustify className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
    </>
  );
}
