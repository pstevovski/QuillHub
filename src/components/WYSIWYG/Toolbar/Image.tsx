import { Image as ImageIcon } from "lucide-react";
import { TipTapComponentProps } from "../TipTapToolbar";
import { Toggle } from "@/ui/toggle";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/ui/alert-dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";

const ImageFormSchema = z.object({
  url: z
    .string()
    .url(
      "Please enter a valid URL for the image. It must start with http(s)://"
    ),
  title: z.string().min(1, "Please provide a title for the image image"),
  alt: z.string().optional(),
});
type ImageUpload = z.infer<typeof ImageFormSchema>;

export default function Image({ editor }: TipTapComponentProps) {
  if (!editor) return null;

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const form = useForm<ImageUpload>({
    resolver: zodResolver(ImageFormSchema),
    defaultValues: {
      url: "",
      title: "",
      alt: "",
    },
  });

  const handleAttachImage = (image: ImageUpload) => {
    // todo: implement functionality
    // should upload the image to the server (uploadthing)
    // that will generate a URL that will be returned back
    // will be included as part of the image that is added to the editor
    console.log("image upload", image);
  };

  return (
    <>
      <AlertDialog open={isMenuOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-500 text-2xl font-bold">
              Attach Image
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Select the image that you'd like to be part of your blog post.{" "}
              <br />
              You can also drag and drop an image directly in the text editor.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Form {...form}>
            <form
              onSubmit={(event) => {
                event.stopPropagation();
                form.handleSubmit(handleAttachImage)(event);
              }}
            >
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-slate-600">URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        id="url"
                        placeholder="https://picsum.photos/200/300"
                        className="placeholder:text-slate-300 focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:ring-transparent"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-slate-600">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        id="title"
                        placeholder="e.g. Mona Lisa"
                        className="placeholder:text-slate-300 focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:ring-transparent"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alt"
                render={({ field }) => (
                  <FormItem className="mb-8">
                    <FormLabel className="text-slate-600">Alt</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        id="alt"
                        placeholder="e.g. A picture by Leonardo Da Vinci portraying a woman"
                        className="placeholder:text-slate-300 focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:ring-transparent"
                      />
                    </FormControl>
                    <FormDescription className="text-slate-400 text-xs">
                      This is optional
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <AlertDialogFooter>
                <AlertDialogCancel
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  type="submit"
                  className="bg-teal-400 hover:bg-teal-500"
                >
                  Attach Image
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>

      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        onPressedChange={() => setIsMenuOpen(true)}
      >
        <ImageIcon className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
    </>
  );
}
