import { Toggle } from "@/ui/toggle";
import { Undo2, Redo2 } from "lucide-react";
import { TipTapExtensionComponentProps } from "../TipTap";

export default function History({ editor }: TipTapExtensionComponentProps) {
  return (
    <>
      <Toggle
        size="sm"
        pressed={editor.isActive("undo")}
        onPressedChange={() => {
          editor.chain().focus().undo().run();
        }}
      >
        <Undo2 className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("redo")}
        onPressedChange={() => {
          editor.chain().focus().redo().run();
        }}
      >
        <Redo2 className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
    </>
  );
}
