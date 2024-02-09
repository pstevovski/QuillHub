"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TipTapToolbar from "./TipTapToolbar";

// Extensions
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import LinkExtension from "@tiptap/extension-link";

// interface TipTapEditorProps {
//   content: string;
//   placeholder?: string;
//   handleOnEditorUpdate: (richText: string) => void;
// }

const Tiptap = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (richText: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
          HTMLAttributes: {
            class: "p-2 list-[revert]",
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
          HTMLAttributes: {
            class: "p-2 list-[decimal]",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class:
              "p-2 border-l-4 border-l-slate-200 bg-slate-50 text-slate-500",
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "my-4",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: "bg-slate-100 text-slate-400 p-4 rounded-md",
          },
        },
        code: {
          HTMLAttributes: {
            class: "bg-slate-100 text-red-600 p-2 rounded-md",
          },
        },
      }),
      CharacterCount.configure(),
      Placeholder.configure({
        placeholder: "Write your blog post...",
      }),
      Underline.configure(),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography.configure(),
      LinkExtension.configure({
        HTMLAttributes: {
          class: "text-sky-500 underline",
        },
      }),
    ],
    content,
    editorProps: {
      handleDrop: () => alert("yo you dropped something"),
      attributes: {
        class: "rounded-md border border-slate-200 text-slate-600 p-3",
      },
      handleKeyDown: (view, event) => {
        console.log("VIEW & EVENT", { view, event });
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      console.log("EDITOR UPDATE", editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col justify-stretch">
      <TipTapToolbar editor={editor} />
      <EditorContent editor={editor} spellCheck={false} />

      <span className="text-sm text-slate-400 flex justify-end">
        {editor.storage.characterCount.characters()} characters
      </span>
    </div>
  );
};

export default Tiptap;
