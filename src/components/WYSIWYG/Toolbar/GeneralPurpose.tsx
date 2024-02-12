import { Toggle } from "@/ui/toggle";
import {
  Code as CodeInline,
  Code2 as CodeBlock,
  Quote,
  SeparatorHorizontal,
} from "lucide-react";
import { TipTapExtensionComponentProps } from "../TipTap";

export default function GeneralPurpose({
  editor,
}: TipTapExtensionComponentProps) {
  return (
    <>
      <Toggle
        size="sm"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => {
          editor.chain().focus().toggleBlockquote().run();
        }}
      >
        <Quote className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("horizontalRule")}
        onPressedChange={() => {
          editor.chain().focus().setHorizontalRule().run();
        }}
      >
        <SeparatorHorizontal className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("code")}
        onPressedChange={() => {
          editor.chain().focus().toggleCode().run();
        }}
      >
        <CodeInline className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("codeblock")}
        onPressedChange={() => {
          editor.chain().focus().toggleCodeBlock().run();
        }}
      >
        <CodeBlock className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
    </>
  );
}
