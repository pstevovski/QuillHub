"use client";

import Button from "@/components/Buttons/Button";
import DropdownLabel from "@/components/Dropdown/DropdownLabel";
import DropdownSelect from "@/components/Dropdown/Select/DropdownSelect";
import { DropdownSelectClickedItem } from "@/components/Dropdown/Select/DropdownSelectItem";
import FormFieldErrorMessage from "@/components/Form/FormFieldErrorMessage";
import FormTextInput from "@/components/Form/FormTextInput";
import { PostsNew } from "@/db/schema/posts";
import {
  MAX_IMAGE_SIZE,
  SUPPORTED_IMAGE_TYPES,
  convertFileSize,
} from "@/utils/convertFileSize";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// Assets
import { FaArrowLeftLong as GoBackIcon } from "react-icons/fa6";
import { z } from "zod";

const PostCreateSchema = z.object({
  title: z
    .string({
      required_error: "Please enter the title for the blog post",
    })
    .min(5, "Please enter a title that is at least 5 characters long"),
  content: z.string({
    required_error: "Please enter the content of the blog post",
  }),
  status: z
    .enum(["draft", "published"], {
      required_error: "Please select the status of the blog post",
    })
    .default("draft"),
  cover_photo: z
    .custom<File>()
    .refine((file) => {
      if (!file) return false;
      return true;
    }, "Cover photo is required.")
    .refine((file) => {
      if (!file) return false;
      // Check the file size
      return MAX_IMAGE_SIZE > convertFileSize(file.size);
    }, `Maximum image file size is ${MAX_IMAGE_SIZE}MB.`)
    .refine((file) => {
      if (!file) return false;
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
    setValue,
    formState: { errors },
  } = useForm<PostsNew>({
    defaultValues: {
      title: "",
      cover_photo_url: null,
      content: "",
      status: "draft",
      topic_id: undefined,
    },
    resolver: zodResolver(PostCreateSchema),
  });

  /*================================
    BLOG POST STATUS
  =================================*/
  const [status, setStatus] = useState<DropdownSelectClickedItem[]>([
    { text: "Draft", value: "draft" },
  ]);
  const handleStatusSelection = (selectedStatus: DropdownSelectClickedItem) => {
    // Updates the inner selection state of the dropdown component
    setStatus([selectedStatus]);

    // Updates the value to be sent in the form
    // todo: figure a way to autocast the selected value to the defined schema
    setValue("status", selectedStatus.value as "draft" | "published");
  };

  /*================================
    BLOG POST TOPIC

    Note: Currently using fake data.
  =================================*/
  const [topic, setTopic] = useState<DropdownSelectClickedItem[]>([]);
  const handleTopicSelection = (selectedTopic: DropdownSelectClickedItem) => {
    // Updates the inner selection state of the dropdown component
    setTopic([selectedTopic]);

    // Updates the value to be sent in the form
    setValue("topic_id", parseInt(selectedTopic.value as string));
  };

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

        {/* STATUS */}
        <DropdownSelect
          selection={status}
          handleSelection={handleStatusSelection}
        >
          <DropdownLabel>Status</DropdownLabel>
          <DropdownSelect.Trigger
            loading={false}
            disabled={false}
            placeholderText="Select Status"
            modifierClass={errors.status ? "border-red-600" : ""}
          />
          <DropdownSelect.Body>
            <DropdownSelect.Item value="draft">Draft</DropdownSelect.Item>
            <DropdownSelect.Item value="published">
              Published
            </DropdownSelect.Item>
          </DropdownSelect.Body>
          <FormFieldErrorMessage error={errors.status} />
        </DropdownSelect>

        {/* TOPIC */}
        <DropdownSelect
          selection={topic}
          handleSelection={handleTopicSelection}
        >
          <DropdownLabel>Topic</DropdownLabel>
          <DropdownSelect.Trigger
            loading={false}
            disabled={false}
            placeholderText="Select Topic"
            modifierClass={errors.topic_id ? "border-red-600" : ""}
          />
          <DropdownSelect.Body>
            <DropdownSelect.Item value="1">Topic #1</DropdownSelect.Item>
            <DropdownSelect.Item value="2">Topic #2</DropdownSelect.Item>
            <DropdownSelect.Item value="3">Topic #3</DropdownSelect.Item>
            <DropdownSelect.Item value="4">Topic #4</DropdownSelect.Item>
            <DropdownSelect.Item value="5">Topic #5</DropdownSelect.Item>
          </DropdownSelect.Body>
          <FormFieldErrorMessage error={errors.topic_id} />
        </DropdownSelect>

        {/* Todo: Add file upload for "Cover Photo" field */}
        {/* Todo: Add Textarea for "Content" field, change with WYSIWIG later */}

        <Button type="submit">Create Post</Button>
      </form>
    </div>
  );
}
