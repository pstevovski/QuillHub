"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TipTapToolbar from "./TipTapToolbar";

const Tiptap = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (richText: string) => void;
}) => {
  const editor = useEditor({
    extensions: [StarterKit.configure()],
    content,
    editorProps: {
      attributes: {
        class: "rounded-md border",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      console.log("EDITOR UPDATE", editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col justify-stretch">
      <TipTapToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
