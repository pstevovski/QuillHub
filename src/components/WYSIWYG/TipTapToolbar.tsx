"use client";
import { type Editor } from "@tiptap/react";

interface TipTapToolbarProps {
  editor: Editor | null;
}

export default function TipTapToolbar({ editor }: TipTapToolbarProps) {
  // Do not render anything if the editor instance is not available yet
  if (!editor) return null;

  return (
    <div className="border rounded-md border-input bg-transparent">
      <span
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
      >
        H1
      </span>
      <span
        onClick={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        Bold
      </span>
    </div>
  );
}
