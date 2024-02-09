import { Toggle } from "@/ui/toggle";
import { Editor } from "@tiptap/react";
import { Bold, Italic, Strikethrough, Underline } from "lucide-react";

export default function TextMarks({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <>
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        <Bold className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => {
          editor.chain().focus().toggleItalic().run();
        }}
      >
        <Italic className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => {
          editor.chain().focus().toggleStrike().run();
        }}
      >
        <Strikethrough className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => {
          editor.chain().focus().toggleUnderline().run();
        }}
      >
        <Underline className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
    </>
  );
}
