import { Toggle } from "@/ui/toggle";

// Icons
import { Link as LinkIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/ui/alert-dialog";
import { useState } from "react";
import { Input } from "@/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { useForm } from "react-hook-form";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Checkbox } from "@/ui/checkbox";
import { TipTapExtensionComponentProps } from "../TipTap";

const LinkFormSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL. It must start with http(s)://"),
  new_tab: z.boolean(),
});

export default function Link({ editor }: TipTapExtensionComponentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof LinkFormSchema>>({
    resolver: zodResolver(LinkFormSchema),
    defaultValues: {
      url: "",
      new_tab: true,
    },
  });

  const handleSubmitURL = ({
    url,
    new_tab,
  }: z.infer<typeof LinkFormSchema>) => {
    if (editor.state.selection.empty) {
      toast.error(
        "You must first select the text to which you want to add this link."
      );
      return;
    }

    // Make a link out of the selected text
    editor.commands.toggleLink({
      href: url,
      target: new_tab ? "_blank" : null,
    });

    // Close the dialog menu
    setIsMenuOpen(false);
  };

  return (
    <div>
      <AlertDialog open={isMenuOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-500 text-2xl font-bold">
              Add Link
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Provide the link URL that you want to use. <br />
              You can also paste a link directly in the text editor.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Form {...form}>
            <form
              onSubmit={(event) => {
                event.stopPropagation();
                form.handleSubmit(handleSubmitURL)(event);
              }}
            >
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="text-slate-600">URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        id="url"
                        placeholder="https://google.com"
                        className="placeholder:text-slate-300 focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:ring-transparent"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new_tab"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0 mb-6">
                    <FormControl>
                      <Checkbox
                        defaultChecked={field.value}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-slate-200 [&>span]:bg-teal-400 !checked:border-red-900"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-slate-400 font-normal cursor-pointer">
                        Open in New Tab?
                      </FormLabel>
                    </div>
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
                  Add Link
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
        disabled={editor.state.selection.empty}
      >
        <LinkIcon className="text-slate-600 w-[16px] h-[16px]" />
      </Toggle>
    </div>
  );
}
