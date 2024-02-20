// Utilities & Hooks
import fetchHandler from "@/utils/fetchHandler";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import cn from "@/utils/classnames";

// Form
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { AuthSignInFields, VALIDATION_SCHEMA_AUTH_SIGNIN } from "@/zod/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

// Components
import { Input } from "@/ui/input";
import { Checkbox } from "@/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/tooltip";
import { Separator } from "@/ui/separator";
import { Button } from "@/ui/button";
import Loader from "@/components/Loaders/Loader";

// Icons
import { InfoIcon } from "lucide-react";

// Interfaces
import { ModalAuthCommonProps } from "./Auth";

export default function ModalSignIn({
  handleModalAuthType,
  handleModalClose,
}: ModalAuthCommonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");

  const form = useForm<AuthSignInFields>({
    defaultValues: { email: "", password: "", remember_me: false },
    resolver: zodResolver(VALIDATION_SCHEMA_AUTH_SIGNIN),
  });

  const handleSignIn: SubmitHandler<AuthSignInFields> = async (credentials) => {
    try {
      await fetchHandler("POST", "auth/signin", credentials);

      // Redirect user to the initially requested URL, or silently refresh the web app
      // note: Using `router.push` didn't work as intended.
      if (redirectUrl) {
        window.location.replace(redirectUrl);
      } else {
        router.refresh();
      }

      handleModalClose();
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
  };

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute p-6 w-full"
    >
      <h3 className="text-2xl text-slate-600 font-semibold mb-2">Sign In</h3>
      <div className={cn("flex items-center", redirectUrl ? "mb-2" : "mb-8")}>
        <p className="text-md text-slate-400">New to QuillHub? </p>
        <button
          type="button"
          className="text-md text-teal-500 hover:text-teal-600 cursor-pointer duration-300 ml-2"
          onClick={() => handleModalAuthType("sign_up")}
        >
          Create an account
        </button>
      </div>

      {redirectUrl ? (
        <p className="text-sm text-rose-500 font-medium mb-6">
          Before accessing the page that you requested, you must be signed in.
        </p>
      ) : null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignIn)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="text-slate-400">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    id="email"
                    placeholder="your@email.com"
                    className="placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-8">
                <FormLabel className="text-slate-400">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    id="password"
                    placeholder="**********"
                    className="placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="remember_me"
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
                  <FormLabel className="flex items-center text-slate-400 font-normal cursor-pointer">
                    Remember me
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger type="button" className="ml-2">
                          <InfoIcon className="h-[16px] w-[16px]" />
                        </TooltipTrigger>
                        <TooltipContent
                          sideOffset={8}
                          className="max-w-[250px] text-center text-slate-400 p-4"
                        >
                          <p>
                            Remain signed in for 30 days. <br />
                            Its best to use this option on a personal computer.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Separator className="mb-4" />

          <button
            type="button"
            className="text-slate-400 text-xs hover:text-teal-500 duration-300 cursor-pointer mb-4"
            onClick={() => handleModalAuthType("password_forgot")}
          >
            Forgot Password?
          </button>

          <Button className="my-4" disabled={form.formState.isSubmitting}>
            Sign In
            {form.formState.isSubmitting ? (
              <Loader modifierClass="ml-3" />
            ) : null}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
