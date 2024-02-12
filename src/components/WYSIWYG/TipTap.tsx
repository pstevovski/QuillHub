"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// Extensions
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import ToolbarHeadings from "./Toolbar/Headings";
import { Separator } from "@/ui/separator";
import TextMarks from "./Toolbar/TextMarks";
import TextAlignment from "./Toolbar/TextAlignment";
import Lists from "./Toolbar/Lists";
import GeneralPurpose from "./Toolbar/GeneralPurpose";
import Link from "./Toolbar/Link";
import Image from "./Toolbar/Image";
import History from "./Toolbar/History";
import { UploadFileResponse } from "uploadthing/client";

interface TipTapEditorProps {
  defaultContent: string | undefined;
  placeholder?: string;
  handleAttachedImage?: (uploadedImage: UploadFileResponse<unknown>) => void;
  handleEditorUpdate: (richText: string) => void;
}

export interface TipTapExtensionComponentProps {
  editor: Editor;
  handleAttachedImage?: (uploadedImage: UploadFileResponse<unknown>) => void;
}

const Tiptap = ({
  defaultContent,
  placeholder = "Write your blog post...",
  handleEditorUpdate,
  handleAttachedImage,
}: TipTapEditorProps) => {
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
        placeholder: placeholder,
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
      ImageExtension.configure({
        HTMLAttributes: {
          class: "my-8",
        },
      }),
    ],
    content: defaultContent,
    editorProps: {
      handleDrop: () => alert("yo you dropped something"),
      attributes: {
        class: "rounded-md border border-slate-200 text-slate-600 p-3",
      },
    },
    onUpdate({ editor }) {
      handleEditorUpdate(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col justify-stretch">
      <div className="flex flex-wrap items-center gap-1 p-2 border rounded-md border-input bg-transparent my-2">
        <ToolbarHeadings editor={editor} />
        <History editor={editor} />
        <Separator orientation="vertical" className="h-[24px] mx-2" />
        <TextMarks editor={editor} />
        <Separator orientation="vertical" className="h-[24px] mx-2" />
        <TextAlignment editor={editor} />
        <Separator orientation="vertical" className="h-[24px] mx-2" />
        <Lists editor={editor} />
        <Separator orientation="vertical" className="h-[24px] mx-2" />
        <GeneralPurpose editor={editor} />
        <Separator orientation="vertical" className="h-[24px] mx-2" />
        <Link editor={editor} />
        <Image editor={editor} handleAttachedImage={handleAttachedImage} />

        {/* TODO: Add Color extension together with custom trigger for color input selection */}
        {/* TODO: 
          Add Image extension together with custom functionality for handling image upload / drop from outside
        - https://www.codemzy.com/blog/tiptap-drag-drop-image
      */}
        {/* TODO: Add Youtube extension (??) */}
        {/* TODO: Add shortcuts info icon that will open a dialog (modal) listing all of the shortcuts available */}
      </div>

      <EditorContent editor={editor} spellCheck={false} />

      <span className="text-sm text-slate-400 flex justify-end">
        {editor.storage.characterCount.characters()} characters
      </span>
    </div>
  );
};

export default Tiptap;
