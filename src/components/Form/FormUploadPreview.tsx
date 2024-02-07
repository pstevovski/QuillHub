import cn from "@/utils/classnames";
import { convertFileSize } from "@/utils/convertFileSize";
import { useEffect, useState } from "react";

interface FormUploadPreviewProps {
  fileToPreview: any;
  modifierClass?: string;
}

export default function FormUploadPreview({
  fileToPreview,
  modifierClass = "",
}: FormUploadPreviewProps) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!fileToPreview || !fileToPreview.length || !fileToPreview[0]) return;

    // Target the first
    const objectURL = window.URL.createObjectURL(fileToPreview[0]);
    setThumbnailPreview(objectURL);
  }, [fileToPreview]);

  if (!thumbnailPreview) return;

  return (
    <div>
      <img
        className={cn(
          "block max-w-[250px] max-h-[250px] w-full h-full rounded-md",
          modifierClass
        )}
        src={thumbnailPreview}
      />

      <div>
        <span className="block text-sm text-slate-400">
          {fileToPreview[0].name},
          <span className="ml-2">
            {convertFileSize(fileToPreview[0].size)}MB
          </span>
        </span>
      </div>
    </div>
  );
}
