"use client";
import { Toggle } from "@/ui/toggle";
import { type Editor } from "@tiptap/react";

// Assets
import {
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  SeparatorHorizontal,
  Code as CodeInline,
  Code2 as CodeBlock,
} from "lucide-react";
import ToolbarHeadings from "./Toolbar/Headings";
import TextMarks from "./Toolbar/TextMarks";
import { Separator } from "@/ui/separator";
import TextAlignment from "./Toolbar/TextAlignment";

export interface TipTapComponentProps {
  editor: Editor | null;
}

export default function TipTapToolbar({ editor }: TipTapComponentProps) {
  // Do not render anything if the editor instance is not available yet
  if (!editor) return null;

  return (
    <div className="border rounded-md border-input bg-transparent">
      <div className="flex items-center gap-1">
        <ToolbarHeadings editor={editor} />
        <TextMarks editor={editor} />
        <Separator orientation="vertical" className="h-[24px] mx-2" />
        <TextAlignment editor={editor} />
        <Separator orientation="vertical" className="h-[24px] mx-2" />
      </div>

      <Toggle
        size="lg"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
      >
        <List />
      </Toggle>
      <Toggle
        size="lg"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => {
          editor.chain().focus().toggleOrderedList().run();
        }}
      >
        <ListOrdered />
      </Toggle>
      <Toggle
        size="lg"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => {
          editor.chain().focus().toggleBlockquote().run();
        }}
      >
        <Quote />
      </Toggle>
      <Toggle
        size="lg"
        pressed={editor.isActive("undo")}
        onPressedChange={() => {
          editor.chain().focus().undo().run();
        }}
      >
        <Undo2 />
      </Toggle>
      <Toggle
        size="lg"
        pressed={editor.isActive("redo")}
        onPressedChange={() => {
          editor.chain().focus().redo().run();
        }}
      >
        <Redo2 />
      </Toggle>

      <Toggle
        size="lg"
        pressed={editor.isActive("horizontalRule")}
        onPressedChange={() => {
          editor.chain().focus().setHorizontalRule().run();
        }}
      >
        <SeparatorHorizontal />
      </Toggle>

      <Toggle
        size="lg"
        pressed={editor.isActive("code")}
        onPressedChange={() => {
          editor.chain().focus().toggleCode().run();
        }}
      >
        <CodeInline />
      </Toggle>

      <Toggle
        size="lg"
        pressed={editor.isActive("codeblock")}
        onPressedChange={() => {
          editor.chain().focus().toggleCodeBlock().run();
        }}
      >
        <CodeBlock />
      </Toggle>

      {/* TODO: Add Link extension together with custom dialog box for handling the URL and target*/}
      {/* TODO: Add Color extension together with custom trigger for color input selection */}
      {/* TODO: 
          Add Image extension together with custom functionality for handling image upload / drop from outside
        - https://www.codemzy.com/blog/tiptap-drag-drop-image
      */}
      {/* TODO: Add Youtube extension (??) */}
      {/* TODO: Add shortcuts info icon that will open a dialog (modal) listing all of the shortcuts available */}
    </div>
  );
}
