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
import { UPLOADTHING_UPLOADED_IMAGE_BASE_URL } from "@/services/uploads";

interface TipTapEditorProps {
  defaultContent: string | undefined;
  placeholder?: string;
  handleUploadedImageKey: (uploadedImageKey: string) => void;
  handleEditorUpdate: (richText: string) => void;
}

export interface TipTapExtensionComponentProps {
  editor: Editor;
  handleUploadedImageKey?: (uploadedImageKey: string) => void;
}

const Tiptap = ({
  defaultContent,
  placeholder = "Write your blog post...",
  handleEditorUpdate,
  handleUploadedImageKey,
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
      attributes: {
        class:
          "rounded-md rounded-tl-none rounded-tr-none border border-t-0 border-slate-200 text-slate-600 p-3 min-h-[500px] focus-visible:outline-none",
      },
    },
    onUpdate({ editor, transaction }) {
      handleEditorUpdate(editor.getHTML());

      // Triggered before an action occurs in the editor
      // In this specific scenario its the "Delete" action
      transaction.before.forEach((node) => {
        // Ignore removal of non-image nodes
        if (node.type.name !== "image") return;

        // Ignore nodes that do not have a valid "src" attribute
        if (!node.attrs.src) return;

        // Ignore image nodes whose "src" attribute does not start with the same base URL as Uploadthing
        // prettier-ignore
        if (!node.attrs.src.startsWith(UPLOADTHING_UPLOADED_IMAGE_BASE_URL)) return;

        // Extract the unique key of the uploaded image
        // Note: Uploadthing service always uses the unique key as a slug to the specific image
        // therefor we target the first element right after we split based on the base URL
        const imageKey = node.attrs.src.split(
          UPLOADTHING_UPLOADED_IMAGE_BASE_URL
        )[1];

        // If there's no image key to work with - dont do anything
        if (!imageKey) return;

        // Add the deleted image key to the list of keys that should be handled
        handleUploadedImageKey(imageKey);
      });
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col justify-stretch my-2">
      <div className="flex flex-wrap items-center gap-1 p-2 border border-b-0 rounded-md rounded-bl-none rounded-br-none bg-transparent">
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
        <Image
          editor={editor}
          handleUploadedImageKey={handleUploadedImageKey}
        />
        <Separator className="my-2" />

        {/* TODO: Add Color extension together with custom trigger for color input selection */}
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
