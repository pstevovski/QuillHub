"use client";
import { type Editor } from "@tiptap/react";

// Assets
import ToolbarHeadings from "./Toolbar/Headings";
import TextMarks from "./Toolbar/TextMarks";
import { Separator } from "@/ui/separator";
import TextAlignment from "./Toolbar/TextAlignment";
import Lists from "./Toolbar/Lists";
import GeneralPurpose from "./Toolbar/GeneralPurpose";
import History from "./Toolbar/History";
import Link from "./Toolbar/Link";

export interface TipTapComponentProps {
  editor: Editor | null;
}

export default function TipTapToolbar({ editor }: TipTapComponentProps) {
  // Do not render anything if the editor instance is not available yet
  if (!editor) return null;

  return (
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
