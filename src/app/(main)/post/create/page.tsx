"use client";

import FormTextInput from "@/components/Form/FormTextInput";
import { PostsNew } from "@/db/schema/posts";
import {
  MAX_IMAGE_SIZE,
  SUPPORTED_IMAGE_TYPES,
  convertFileSize,
} from "@/utils/convertFileSize";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";

// Assets
import { FaArrowLeftLong as GoBackIcon } from "react-icons/fa6";
import { z } from "zod";

const PostCreateSchema = z.object({
  title: z.string({
    required_error: "Please enter the title for the blog post",
  }),
  content: z.string({
    required_error: "Please enter the content of the blog post",
  }),
  status: z.enum(["Draft", "Published"]).default("Draft"),
  cover_photo: z
    .custom<File>()
    .refine((file) => !file, "Cover photo is required.")
    .refine((file) => {
      // Check the file size
      return MAX_IMAGE_SIZE > convertFileSize(file.size);
    }, `Maximum image file size is ${MAX_IMAGE_SIZE}MB.`)
    .refine((file) => {
      // Check if the file type is supportewd
      return SUPPORTED_IMAGE_TYPES.includes(file.type);
    }, "Selected image file type is not supported"),
  topic_id: z.number({
    required_error: "Please select a topic for the blog post",
  }),
});

export default function PostCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostsNew>({
    defaultValues: {
      title: "",
      cover_photo_url: null,
      content: "",
      status: "draft",
    },
    resolver: zodResolver(PostCreateSchema),
  });

  const handlePostCreate: SubmitHandler<PostsNew> = async (values) => {
    console.log("creating blog post...", values);
  };

  return (
    <div>
      <Link
        href="/"
        prefetch
        className="flex items-center text-slate-400 hover:text-teal-500 duration-300 text-xl mt-10 mb-20"
      >
        <GoBackIcon className="mr-2" />
        Go Back
      </Link>

      <h1 className="text-teal-500 text-5xl font-bold mb-2">
        Write your blog post
      </h1>
      <p className="text-sm text-slate-400 mb-14">
        Unfold your imagination and make your stories come to life.
      </p>

      <form onSubmit={handleSubmit(handlePostCreate)}>
        <FormTextInput
          label="Title"
          register={register("title")}
          error={errors.title}
          placeholder=""
          autoComplete="title"
          modifierClass="max-w-lg"
        />
      </form>
    </div>
  );
}
