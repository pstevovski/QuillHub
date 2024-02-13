"use client";

import Button from "@/components/Buttons/Button";
import DropdownLabel from "@/components/Dropdown/DropdownLabel";
import DropdownSelect from "@/components/Dropdown/Select/DropdownSelect";
import { DropdownSelectClickedItem } from "@/components/Dropdown/Select/DropdownSelectItem";
import FormFieldErrorMessage from "@/components/Form/FormFieldErrorMessage";
import FormTextInput from "@/components/Form/FormTextInput";
import { PostsNew } from "@/db/schema/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// Assets
import { FaArrowLeftLong as GoBackIcon } from "react-icons/fa6";
import Tiptap from "@/components/WYSIWYG/TipTap";
import { UploadFileResponse } from "uploadthing/client";
import { toast } from "sonner";
import handleErrorMessage from "@/utils/handleErrorMessage";
import fetchHandler from "@/utils/fetchHandler";
import { BlogNewPostSchema } from "@/zod/blog-posts";
import { UploadButton } from "@/components/UploadThing";
import { Label } from "@/ui/label";

export default function PostCreate() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<PostsNew>({
    defaultValues: {
      title: "",
      content: "",
      status: undefined,
      cover_photo: undefined,
    },
    resolver: zodResolver(BlogNewPostSchema),
  });
  const watchCoverPhoto = watch("cover_photo");
  const [isUploadingCoverPhoto, setIsUploadingCoverPhoto] =
    useState<boolean>(false);

  /*================================
    BLOG POST STATUS
  =================================*/
  const [status, setStatus] = useState<DropdownSelectClickedItem[]>([]);
  const handleStatusSelection = (selectedStatus: DropdownSelectClickedItem) => {
    // Updates the inner selection state of the dropdown component
    setStatus([selectedStatus]);

    // Updates the value to be sent in the form
    // todo: figure a way to autocast the selected value to the defined schema
    setValue("status", selectedStatus.value as "draft" | "published");
  };

  /*================================
    BLOG POST TOPICS

    To be implemented
  =================================*/
  // const [topic, setTopic] = useState<DropdownSelectClickedItem[]>([]);
  // const handleTopicSelection = (selectedTopic: DropdownSelectClickedItem) => {
  //   // Updates the inner selection state of the dropdown component
  //   setTopic([selectedTopic]);

  //   // Updates the value to be sent in the form
  //   setValue("topic_id", parseInt(selectedTopic.value as string));
  // };

  /*================================
    COVER PHOTO
  ==================================*/
  const handleUploadCoverPhoto = (response: UploadFileResponse<unknown>[]) => {
    setValue("cover_photo", response[0].url);
    setIsUploadingCoverPhoto(false);
    handleUploadedCoverImagesKeys(response[0].key);
  };

  /*===============================
    UPLOADED IMAGES
  ================================*/
  const [uploadedContentImagesKeys, setUploadedContentImagesKeys] = useState<
    string[]
  >([]);
  const [uploadedCoverImagesKeys, setUploadedCoverImagesKeys] = useState<
    string[]
  >([]);

  const handleUploadedContentImagesKeys = (imageKey: string) => {
    const copyContentImages = [...uploadedContentImagesKeys];
    copyContentImages.push(imageKey);
    setUploadedContentImagesKeys(copyContentImages);
  };

  const handleUploadedCoverImagesKeys = (imageKey: string) => {
    const copyCoverImages = [...uploadedCoverImagesKeys];
    copyCoverImages.push(imageKey);
    setUploadedCoverImagesKeys(copyCoverImages);
  };

  /*===============================
    SEND API REQUEST
  ================================*/
  const handlePostCreate: SubmitHandler<PostsNew> = async (values) => {
    try {
      const { message } = await fetchHandler("POST", "blog", {
        ...values,
        uploaded_content_images_keys: uploadedContentImagesKeys,
        uploaded_cover_images_keys: uploadedCoverImagesKeys,
      });

      toast.success(message);
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
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
        <div className="flex flex-col items-start mb-6">
          <Label className="text-sm text-slate-400">Cover Photo</Label>
          <p className="text-xs text-slate-400 mb-4">
            Upload a cover photo for your blog post
          </p>
          <UploadButton
            endpoint="blogPostCoverPhoto"
            onUploadBegin={() => setIsUploadingCoverPhoto(true)}
            onClientUploadComplete={handleUploadCoverPhoto}
            onUploadError={() => {
              toast.error("Failed uploading cover photo. Please try again!");
              setIsUploadingCoverPhoto(false);
            }}
            appearance={{
              button: ({ isUploading }) =>
                `bg-teal-400 hover:bg-teal-500 duration-300 ${
                  isUploading ? "bg-slate-200 cursor-not-allowed" : ""
                }`,
              allowedContent: "w-full text-slate-400 font-medium",
            }}
          />
          {watchCoverPhoto ? (
            <img width="300" height="300" src={watchCoverPhoto} />
          ) : null}
          <FormFieldErrorMessage error={errors.cover_photo} />
        </div>

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
          modifierClass="mb-6"
        >
          <DropdownLabel>Status</DropdownLabel>
          <DropdownSelect.Trigger
            loading={false}
            disabled={false}
            placeholderText="Select Status"
            modifierClass={errors.status ? "border-red-500" : ""}
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
        {/* <DropdownSelect
          selection={topic}
          handleSelection={handleTopicSelection}
          modifierClass="mb-6"
        >
          <DropdownLabel>Topic</DropdownLabel>
          <DropdownSelect.Trigger
            loading={false}
            disabled={false}
            placeholderText="Select Topic"
            modifierClass={errors.topic_id ? "border-red-500" : ""}
          />
          <DropdownSelect.Body>
            <DropdownSelect.Item value="1">Topic #1</DropdownSelect.Item>
            <DropdownSelect.Item value="2">Topic #2</DropdownSelect.Item>
            <DropdownSelect.Item value="3">Topic #3</DropdownSelect.Item>
            <DropdownSelect.Item value="4">Topic #4</DropdownSelect.Item>
            <DropdownSelect.Item value="5">Topic #5</DropdownSelect.Item>
          </DropdownSelect.Body>
          <FormFieldErrorMessage error={errors.topic_id} />
        </DropdownSelect> */}

        <Tiptap
          defaultContent=""
          handleEditorUpdate={(text) => setValue("content", text)}
          handleUploadedImageKey={handleUploadedContentImagesKeys}
        />
        <FormFieldErrorMessage error={errors.content} />

        <Button
          type="submit"
          disabled={!isDirty || isUploadingCoverPhoto}
          modifierClass="mt-10"
        >
          Create Post
        </Button>
      </form>
    </div>
  );
}
