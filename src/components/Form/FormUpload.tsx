import { InputHTMLAttributes, useRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

// Assets
import { HiOutlineUpload as FileUploadIcon } from "react-icons/hi";
import Button from "../Buttons/Button";

interface FormUploadProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn;
  placeholderText?: string;
  modifierClass?: string;
  maxSizeInMB?: number;
}

export default function FormUpload({
  register,
  placeholder = "",
  modifierClass = "",
  maxSizeInMB = 5,
  ...props
}: FormUploadProps) {
  const fileUploadFieldRef = useRef<HTMLInputElement | null>(null);

  // todo: add option for image upload preview

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
    </div>
  );
}
