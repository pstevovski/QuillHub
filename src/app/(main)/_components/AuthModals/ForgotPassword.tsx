"use client";

// Utilities & Hooks
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import fetchHandler from "@/utils/fetchHandler";
import handleErrorMessage from "@/utils/handleErrorMessage";

// Form
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import {
  AuthForgotPasswordFields,
  VALIDATION_SCHEMA_AUTH_FORGOT_PASSWORD,
} from "@/zod/auth";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { motion } from "framer-motion";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import Loader from "@/components/Loaders/Loader";

// Icons
import { FaArrowLeftLong as GoBackIcon } from "react-icons/fa6";

// Interfaces
import { ModalAuthCommonProps } from "./Auth";

export default function ModalForgotPassword({
  handleModalAuthType,
}: ModalAuthCommonProps) {
  const form = useForm<AuthForgotPasswordFields>({
    defaultValues: { email: "" },
    resolver: zodResolver(VALIDATION_SCHEMA_AUTH_FORGOT_PASSWORD),
  });

  const handleSendEmail: SubmitHandler<AuthForgotPasswordFields> = async (
    email
  ) => {
    try {
      const data = await fetchHandler("POST", "auth/forgot-password", email);
      toast.success(data.message);
      handleModalAuthType("sign_in");
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute p-6 w-full"
    >
      <div
        className="flex items-center cursor-pointer group mb-4"
        onClick={() => handleModalAuthType("sign_in")}
      >
        <GoBackIcon className="text-slate-400 mr-2 group-hover:text-slate-500 duration-300" />
        <p className="text-md text-slate-400 group-hover:text-slate-500 duration-300">
          Go Back
        </p>
      </div>

      <h3 className="text-2xl text-slate-600 font-semibold mb-4">
        Forgot your password?
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSendEmail)}>
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

          <Button
            disabled={form.formState.isSubmitting}
            className="flex justify-center items-center w-full my-4 bg-teal-400 hover:bg-teal-500 text-md"
          >
            {form.formState.isSubmitSuccessful ? "Email Sent!" : "Send Email"}
            {form.formState.isSubmitting ? <Loader /> : null}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
