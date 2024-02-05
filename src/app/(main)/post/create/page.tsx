"use client";

import DropdownAction from "@/components/Dropdown/Action/DropdownAction";
import DropdownSelect from "@/components/Dropdown/Select/DropdownSelect";
import { DropdownSelectClickedItem } from "@/components/Dropdown/Select/DropdownSelectItem";
import FormFieldErrorMessage from "@/components/Form/FormFieldErrorMessage";
import FormTextInput from "@/components/Form/FormTextInput";
import { PostsNew } from "@/db/schema/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// Assets
import { FaArrowLeftLong as GoBackIcon } from "react-icons/fa6";
import { z } from "zod";

const PostCreateSchema = z.object({
  title: z
    .string({
      required_error: "Please provide the title for your blog post",
    })
    .min(5),
  content: z.string({
    required_error: "Please provide the content for your blog post",
  }),
  status: z.string({
    required_error: "Please select the status of the blog post",
  }),
});

export default function PostCreate() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostsNew>({
    defaultValues: {
      title: "",
      cover_photo_url: null,
      content: "",
      status: "draft",
    },
    resolver: zodResolver(PostCreateSchema),
  });

  // Dropdown Selection
  const [selection, setSelection] = useState<DropdownSelectClickedItem[]>([]);
  const handleDropdownSelection = (selectedItem: DropdownSelectClickedItem) => {
    // single select
    // setSelection([item]);

    // multi select
    const selectionCopy = [...selection];
    const selectedItemIndex = selectionCopy.findIndex(
      (item) => item.value === selectedItem.value
    );

    if (selectedItemIndex >= 0) {
      selectionCopy.splice(selectedItemIndex, 1);
    } else {
      selectionCopy.push(selectedItem);
    }

    setSelection(selectionCopy);
  };

  useEffect(() => {
    console.log("SELECTION", selection);
  }, [selection]);

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
        <span {...register("views")} onClick={() => setValue("views", 123456)}>
          views testing
        </span>

        <button>Submit</button>

        <FormTextInput
          label="Title"
          register={register("title")}
          error={errors.title}
          placeholder=""
          autoComplete="title"
          modifierClass="max-w-lg"
        />

        <DropdownSelect
          selection={selection}
          handleSelection={handleDropdownSelection}
        >
          <DropdownSelect.Label>Testing Selection</DropdownSelect.Label>
          <DropdownSelect.Trigger
            loading={false}
            disabled={false}
            placeholderText="Testing Select"
          />
          <DropdownSelect.Body>
            <DropdownSelect.Item value="value_1">Value #1</DropdownSelect.Item>
            <DropdownSelect.Item value="value_2">Value #2</DropdownSelect.Item>
            <DropdownSelect.Item value="value_3">Value #3</DropdownSelect.Item>
          </DropdownSelect.Body>
        </DropdownSelect>
        <FormFieldErrorMessage error={errors.title} />

        <DropdownAction>
          <DropdownAction.Trigger loading={false} disabled={false} />
          <DropdownAction.Body>
            <DropdownAction.Item
              value="value_4"
              handleClickedActionItem={(item) => alert(item.text)}
            >
              Value #4
            </DropdownAction.Item>
          </DropdownAction.Body>
        </DropdownAction>
      </form>
    </div>
  );
}
