"use client";

// Components
import Button from "@/components/Buttons/Button";
import FormTextInput from "@/components/Form/FormTextInput";
import Link from "next/link";

// Validation schemas
import { AuthForgotPasswordFields, AuthForgotPasswordSchema } from "@/zod/auth";

// Forms
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

export default function AuthForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthForgotPasswordFields>({
    defaultValues: { email: "" },
    resolver: zodResolver(AuthForgotPasswordSchema),
  });

  // todo: connect with API and send actual request
  const handleSendEmail: SubmitHandler<AuthForgotPasswordFields> = (
    credentials
  ) => {
    console.log("CREDENTIALS: ", credentials);
  };

  return (
    <form onSubmit={handleSubmit(handleSendEmail)} autoComplete="">
      <FormTextInput
        register={register("email")}
        error={errors.email}
        placeholder="your@email.com"
        autoComplete="new-password"
      />

      <Button type="submit" variant="primary" size="full" modifierClass="mb-4">
        Send Email
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
