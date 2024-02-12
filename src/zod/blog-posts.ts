import { z } from "zod";

export const BlogNewPostSchema = z.object({
  title: z
    .string({
      required_error: "Please enter the title for the blog post",
    })
    .min(5, "Please enter a title that is at least 5 characters long"),
  content: z
    .string({
      required_error: "Blog Post content is required",
    })
    .min(1, "Please enter the content of your blog post"),
  status: z.enum(["draft", "published"], {
    required_error: "Please select the status of the blog post",
  }),
  // cover_photo: z
  //   .custom<FileList>()
  //   .refine((files) => {
  //     return Array.from(files ?? []).length !== 0;
  //   }, "Cover photo is required")
  //   .refine((files) => {
  //     return Array.from(files ?? []).every((file) => {
  //       return SUPPORTED_IMAGE_TYPES.some(
  //         (imageType) => imageType === file.type
  //       );
  //     });
  //   }, "Selected file type is not supported")
  //   .refine((files) => {
  //     return Array.from(files ?? []).every((file) => {
  //       return convertFileSize(file.size) <= MAX_IMAGE_SIZE;
  //     });
  //   }, `Maximum cover photo image size is ${MAX_IMAGE_SIZE}MB`),
});
