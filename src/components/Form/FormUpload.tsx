import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { convertFileSize } from "@/utils/convertFileSize";

// Assets
import { HiOutlineUpload as FileUploadIcon } from "react-icons/hi";
import { IoTrashBinOutline as FileUploadClearIcon } from "react-icons/io5";

import Button from "../Buttons/Button";

interface FormUploadProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn;
  selectedFile: File | null;
  handleClearSelection: () => void;
  placeholderText?: string;
  modifierClass?: string;
  hasPreview?: boolean;
  maxSizeInMB?: number;
}

function FormUpload({
  register,
  selectedFile,
  placeholder = "",
  modifierClass = "",
  maxSizeInMB = 5,
  hasPreview = false,
  handleClearSelection,
  ...props
}: FormUploadProps) {
  const fileUploadFieldRef = useRef<HTMLInputElement | null>(null);

  /*======================
    PREVIEW DETAILS
  =======================*/
  const [fileDetails, setFileDetails] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    setFileDetails(selectedFile);
  }, [selectedFile]);

  // Generate a thumbnail preview image
  useEffect(() => {
    if (!fileDetails || !hasPreview) {
      setThumbnailPreview(undefined);
      return;
    }

    const fileObjectURL = URL.createObjectURL(fileDetails);
    setThumbnailPreview(fileObjectURL);
  }, [fileDetails]);

  return (
    <div className="relative">
      <input
        type="file"
        hidden
        {...register}
        ref={(el) => {
          // Override the "ref" appended from react-hook-form "register"
          // so we can add additional ref to be used for targeting the input
          register.ref(el);
          fileUploadFieldRef.current = el;
        }}
        {...props}
      />

      {/* FILE UPLOAD PREVIEW */}
      {thumbnailPreview ? (
        <img
          className="block max-w-[350px] max-h-[350px] w-full h-full rounded-md"
          src={thumbnailPreview}
        />
      ) : null}

      {/* FILE DETAILS */}
      {fileDetails ? (
        <span className="text-sm text-slate-500">
          {fileDetails.name}, {convertFileSize(fileDetails.size)}MB
        </span>
      ) : null}

      <div className="flex items-center">
        <Button
          type="button"
          size="sm"
          onClick={() => {
            fileUploadFieldRef.current?.click();
          }}
        >
          Upload
          <FileUploadIcon className="text-xl ml-2" />
        </Button>

        {fileDetails ? (
          <div
            className="flex items-center group cursor-pointer"
            onClick={handleClearSelection}
          >
            <FileUploadClearIcon className="text-slate-400 text-lg ml-2 group-hover:text-red-500 duration-300" />
            <span className="text-slate-400 text-sm ml-1 group-hover:text-red-500 duration-300">
              Clear Selection?
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default FormUpload;
