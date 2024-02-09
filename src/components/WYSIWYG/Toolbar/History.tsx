import { Toggle } from "@/ui/toggle";
import { TipTapComponentProps } from "../TipTapToolbar";
import { Undo2, Redo2 } from "lucide-react";

export default function History({ editor }: TipTapComponentProps) {
  if (!editor) return null;

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
