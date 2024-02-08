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
    </div>
  );
}
