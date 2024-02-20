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
  AuthResetPasswordFields,
  VALIDATION_SCHEMA_AUTH_RESET_PASSWORD,
} from "@/zod/auth";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { motion } from "framer-motion";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import Loader from "@/components/Loaders/Loader";

// Assets
import { FaArrowLeftLong as GoBackIcon } from "react-icons/fa6";

// Interfaces
import { ModalAuthPasswordResetProps } from "./Auth";

export default function ModalResetPassword({
  token,
  handleModalAuthType,
}: ModalAuthPasswordResetProps) {
  const form = useForm<AuthResetPasswordFields>({
    defaultValues: { token: token || "", password: "", confirm_password: "" },
    resolver: zodResolver(VALIDATION_SCHEMA_AUTH_RESET_PASSWORD),
  });

  const handleResetPassword: SubmitHandler<AuthResetPasswordFields> = async (
    payload
  ) => {
    if (!token) {
      toast.error("No password reset token provided!");
      return;
    }

    try {
      const data = await fetchHandler("POST", "auth/reset-password", payload);
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
        Reset your password
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleResetPassword)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="text-slate-400">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    id="password"
                    placeholder="***********"
                    className="placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="text-slate-400">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    id="confirm_password"
                    placeholder="***********"
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
            Reset Password
            {form.formState.isSubmitting ? <Loader /> : null}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
