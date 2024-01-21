"use client";

import fetchHandler from "@/utils/fetchHandler";
import handleErrorMessage from "@/utils/handleErrorMessage";
import {
  AuthForgotPasswordFields,
  AuthForgotPasswordSchema,
  AuthResetPasswordFields,
  AuthResetPasswordSchema,
  AuthSignInFields,
  AuthSignInSchema,
  AuthSignUpFields,
  AuthSignUpSchema,
} from "@/zod/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import FormTextInput from "../Form/FormTextInput";
import FormPasswordInput from "../Form/FormPasswordInput";
import FormCheckbox from "../Form/FormCheckbox";
import Tooltip from "../Tooltips/Tooltip";
import Button from "../Buttons/Button";

// Assets
import { FaCircleInfo as InfoIcon } from "react-icons/fa6";
import { IoClose as CloseIcon } from "react-icons/io5";
import { FaArrowLeftLong as GoBackIcon } from "react-icons/fa6";

type ModalAuthType =
  | "sign_in"
  | "sign_up"
  | "password_forgot"
  | "password_reset";

interface ModalAuthCommonProps {
  handleModalAuthType: (type: ModalAuthType) => void;
  handleModalClose: () => void;
}

interface ModalAuthPasswordResetProps extends ModalAuthCommonProps {
  token: string | null;
}

function ModalAuthSignIn({
  handleModalAuthType,
  handleModalClose,
}: ModalAuthCommonProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthSignInFields>({
    defaultValues: { email: "", password: "", remember_me: false },
    resolver: zodResolver(AuthSignInSchema),
  });

  const handleSignIn: SubmitHandler<AuthSignInFields> = async (credentials) => {
    try {
      await fetchHandler("POST", "auth/signin", credentials);
      router.refresh();
      handleModalClose();
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
  };

  return (
    <div>
      <h3 className="text-2xl text-slate-600 font-semibold mb-2">Sign In</h3>
      <div className="flex items-center mb-8">
        <p className="text-md text-slate-400">New to QuillHub? </p>
        <button
          type="button"
          className="text-md text-teal-500 hover:text-teal-600 cursor-pointer duration-300 ml-2"
          onClick={() => handleModalAuthType("sign_up")}
        >
          Create an account
        </button>
      </div>

      <form onSubmit={handleSubmit(handleSignIn)} autoComplete="off">
        <FormTextInput
          label="Email"
          register={register("email")}
          error={errors.email}
          placeholder="your@email.com"
          autoComplete="email"
        />
        <FormPasswordInput
          label="Password"
          register={register("password")}
          error={errors.password}
          autoComplete="current-password"
        />

        <button
          type="button"
          className="text-slate-400 text-sm hover:text-teal-500 duration-300 cursor-pointer mb-4"
          onClick={() => handleModalAuthType("password_forgot")}
        >
          Forgot Password?
        </button>

        <hr className="border-none sticky w-full h-[1px] bg-gradient-to-r from-white via-slate-200 to-white mb-4" />

        <div className="flex items-start">
          <FormCheckbox
            modifierClass="mb-8 mr-4"
            text="Remember Me"
            register={register("remember_me")}
          />

          <Tooltip
            text="Remain signed in for 30 days. Its best to use this option on a personal computer."
            side="top"
            sideOffset={12}
          >
            <InfoIcon className="text-slate-300 text-md mt-[2px]" />
          </Tooltip>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="full"
          modifierClass="mb-2"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}

function ModalAuthSignUp({
  handleModalAuthType,
  handleModalClose,
}: ModalAuthCommonProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthSignUpFields>({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
    resolver: zodResolver(AuthSignUpSchema),
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
    <div>
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

      <form onSubmit={handleSubmit(handleSignUp)} autoComplete="">
        <FormTextInput
          label="Email"
          register={register("email")}
          error={errors.email}
          placeholder="your@email.com"
          autoComplete="new-password"
        />
        <FormTextInput
          label="First Name"
          register={register("first_name")}
          error={errors.first_name}
          placeholder="John"
          autoComplete="new-password"
        />
        <FormTextInput
          label="Last Name"
          register={register("last_name")}
          error={errors.last_name}
          placeholder="Doe"
          autoComplete="new-password"
        />
        <FormPasswordInput
          label="Password"
          register={register("password")}
          error={errors.password}
        />
        <FormPasswordInput
          label="Confirm Password"
          register={register("confirm_password")}
          error={errors.confirm_password}
        />

        <Button
          type="submit"
          variant="primary"
          size="full"
          modifierClass="mb-4"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
}

function ModalAuthPasswordForgot({
  handleModalAuthType,
}: ModalAuthCommonProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = useForm<AuthForgotPasswordFields>({
    defaultValues: { email: "" },
    resolver: zodResolver(AuthForgotPasswordSchema),
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
    <div>
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

      <form onSubmit={handleSubmit(handleSendEmail)} autoComplete="">
        <FormTextInput
          label="Email"
          register={register("email")}
          error={errors.email}
          placeholder="your@email.com"
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="full"
          modifierClass="mb-4"
          disabled={isSubmitting || isSubmitSuccessful}
          isLoading={isSubmitting}
        >
          {isSubmitSuccessful ? "Email Sent!" : "Send Email"}
        </Button>
      </form>
    </div>
  );
}

function ModalAuthPasswordReset({
  token,
  handleModalAuthType,
}: ModalAuthPasswordResetProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthResetPasswordFields>({
    defaultValues: { token: token || "", password: "", confirm_password: "" },
    resolver: zodResolver(AuthResetPasswordSchema),
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

      // TODO: remove search param
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
  };

  return (
    <div>
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

      <form onSubmit={handleSubmit(handleResetPassword)} autoComplete="">
        <FormPasswordInput
          label="Password"
          register={register("password")}
          error={errors.password}
          autoComplete="new-password"
        />
        <FormPasswordInput
          label="Confirm Password"
          register={register("confirm_password")}
          error={errors.confirm_password}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="full"
          modifierClass="mb-4"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}

export function ModalAuth({
  passwordResetToken,
  handleModalClose,
}: {
  passwordResetToken: string | null;
  handleModalClose: () => void;
}) {
  const [modalType, setModalType] = useState<ModalAuthType>(() => {
    return passwordResetToken ? "password_reset" : "sign_in";
  });
  const handleModalAuthType = (type: ModalAuthType) => setModalType(type);

  return (
    <div>
      {/* overlay */}
      <div className="fixed top-0 left-0 max-w-screen w-full h-screen bg-slate-400 opacity-30"></div>

      {/* content */}
      <div className="z-10 fixed top-1/2 left-1/2 p-6 border rounded max-w-lg w-full bg-white -translate-y-1/2 -translate-x-1/2">
        <CloseIcon
          className="absolute top-6 right-4 text-2xl text-slate-400 hover:text-rose-500 duration-300 cursor-pointer"
          onClick={handleModalClose}
        />

        {modalType === "sign_in" ? (
          <ModalAuthSignIn
            handleModalAuthType={handleModalAuthType}
            handleModalClose={handleModalClose}
          />
        ) : null}

        {modalType === "sign_up" ? (
          <ModalAuthSignUp
            handleModalClose={handleModalClose}
            handleModalAuthType={handleModalAuthType}
          />
        ) : null}

        {modalType === "password_forgot" ? (
          <ModalAuthPasswordForgot
            handleModalClose={handleModalClose}
            handleModalAuthType={handleModalAuthType}
          />
        ) : null}

        {modalType === "password_reset" ? (
          <ModalAuthPasswordReset
            token={passwordResetToken}
            handleModalClose={handleModalClose}
            handleModalAuthType={handleModalAuthType}
          />
        ) : null}
      </div>
    </div>
  );
}
