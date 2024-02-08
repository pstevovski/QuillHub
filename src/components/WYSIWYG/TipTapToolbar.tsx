"use client";
import { Toggle } from "@/ui/toggle";
import { type Editor } from "@tiptap/react";

// Assets
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Bold,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Italic,
  Strikethrough,
  SeparatorHorizontal,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code as CodeInline,
  Code2 as CodeBlock,
} from "lucide-react";

interface TipTapToolbarProps {
  editor: Editor | null;
}

export default function TipTapToolbar({ editor }: TipTapToolbarProps) {
  // Do not render anything if the editor instance is not available yet
  if (!editor) return null;

  return (
    <div className="border rounded-md border-input bg-transparent">
      <Toggle
        size="lg"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() => {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
      >
        <Heading1 />
      </Toggle>
      <Toggle
        size="lg"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() => {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
      >
        <Heading2 />
      </Toggle>
      <Toggle
        size="lg"
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() => {
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
      >
        <Heading3 />
      </Toggle>
      <Toggle
        size="lg"
        pressed={editor.isActive("heading", { level: 4 })}
        onPressedChange={() => {
          editor.chain().focus().toggleHeading({ level: 4 }).run();
        }}
      >
        <Heading4 />
      </Toggle>
      <Toggle
        size="lg"
        pressed={editor.isActive("heading", { level: 5 })}
        onPressedChange={() => {
          editor.chain().focus().toggleHeading({ level: 5 }).run();
        }}
      >
        <Heading5 />
      </Toggle>
      <Toggle
        size="lg"
        pressed={editor.isActive("heading", { level: 6 })}
        onPressedChange={() => {
          editor.chain().focus().toggleHeading({ level: 6 }).run();
        }}
      >
        <Heading6 />
      </Toggle>
      <Toggle
        size="lg"
        pressed={editor.isActive("bold")}
        onPressedChange={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        <Bold />
      </Toggle>

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
        pressed={editor.isActive("italic")}
        onPressedChange={() => {
          editor.chain().focus().toggleItalic().run();
        }}
      >
        <Italic />
      </Toggle>

      <Toggle
        size="lg"
        pressed={editor.isActive("strike")}
        onPressedChange={() => {
          editor.chain().focus().toggleStrike().run();
        }}
      >
        <Strikethrough />
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
        pressed={editor.isActive("underline")}
        onPressedChange={() => {
          editor.chain().focus().toggleUnderline().run();
        }}
      >
        <Underline />
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

      {/* TODO: Convert this to dropdown menu */}
      <Toggle
        size="lg"
        pressed={editor.isActive({ textAlign: "left" })}
        onPressedChange={() => {
          editor.chain().focus().setTextAlign("left").run();
        }}
      >
        <AlignLeft />
      </Toggle>
      <Toggle
        size="lg"
        pressed={editor.isActive({ textAlign: "center" })}
        onPressedChange={() => {
          editor.chain().focus().setTextAlign("center").run();
        }}
      >
        <AlignCenter />
      </Toggle>
      <Toggle
        size="lg"
        pressed={editor.isActive({ textAlign: "right" })}
        onPressedChange={() => {
          editor.chain().focus().setTextAlign("right").run();
        }}
      >
        <AlignRight />
      </Toggle>
      <Toggle
        size="lg"
        pressed={editor.isActive({ textAlign: "justify" })}
        onPressedChange={() => {
          editor.chain().focus().setTextAlign("justify").run();
        }}
      >
        <AlignJustify />
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
