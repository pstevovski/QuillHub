"use client";

// Utilities & Hooks
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import fetchHandler from "@/utils/fetchHandler";
import handleErrorMessage from "@/utils/handleErrorMessage";

// Interfaces
import { ModalAuthCommonProps } from "./Auth";

// Schema
import { AuthSignUpFields, VALIDATION_SCHEMA_AUTH_SIGNUP } from "@/zod/auth";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { motion } from "framer-motion";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import Loader from "@/components/Loaders/Loader";

// Assets
import { FaArrowLeftLong as GoBackIcon } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";

export default function ModalSignUp({
  handleModalAuthType,
  handleModalClose,
}: ModalAuthCommonProps) {
  const router = useRouter();
  const form = useForm<AuthSignUpFields>({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
    resolver: zodResolver(VALIDATION_SCHEMA_AUTH_SIGNUP),
  });

  const handleSignUp: SubmitHandler<AuthSignUpFields> = async (newUser) => {
    try {
      // Create the new account
      const data = await fetchHandler("POST", "auth/signup", newUser);
      toast.success(data.message);

      // Login the user with the new account
      await fetchHandler("POST", "auth/signin", {
        email: newUser.email,
        password: newUser.password,
        remember_me: false,
      });

      // Refresh page and close modal
      router.refresh();
      handleModalClose();
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

      <h3 className="text-2xl text-slate-600 font-semibold mb-4">Sign Up</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignUp)}>
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
            name="first_name"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="text-slate-400">First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    id="first_name"
                    placeholder="John"
                    className="placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="text-slate-400">Last Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    id="last_name"
                    placeholder="Doe"
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
              <FormItem className="mb-4">
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
            name="confirm_password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="text-slate-400">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    id="confirm_password"
                    placeholder="**********"
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
            Sign Up
            {form.formState.isSubmitting ? <Loader /> : null}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
