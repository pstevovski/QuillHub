"use client";

// Components
import Button from "@/components/Buttons/Button";
import Link from "next/link";
import FormPasswordInput from "@/components/Form/FormPasswordInput";

// Validation schemas
import { AuthResetPasswordFields, AuthResetPasswordSchema } from "@/zod/auth";

// Forms
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

export default function AuthResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthResetPasswordFields>({
    defaultValues: { password: "", confirm_password: "" },
    resolver: zodResolver(AuthResetPasswordSchema),
  });

  // todo: connect with API and send actual request
  const handleResetPassword: SubmitHandler<AuthResetPasswordFields> = (
    credentials
  ) => {
    console.log("CREDENTIALS: ", credentials);
  };

  return (
    <form onSubmit={handleSubmit(handleResetPassword)} autoComplete="">
      <FormPasswordInput
        register={register("password")}
        error={errors.password}
        autoComplete="new-password"
      />
      <FormPasswordInput
        register={register("confirm_password")}
        error={errors.confirm_password}
        autoComplete="new-password"
      />

      <Button type="submit" variant="primary" size="full" modifierClass="mb-4">
        Reset Password
      </Button>

      <div className="flex justify-center">
        <Link
          className=" text-slate-400 text-sm hover:text-slate-600 duration-200"
          href="/auth/signin"
        >
          Go Back
        </Link>
      </div>
    </form>
  );
}
