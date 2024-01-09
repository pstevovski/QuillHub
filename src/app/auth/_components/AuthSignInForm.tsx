"use client";

// Components
import Button from "@/components/Buttons/Button";
import FormPasswordInput from "@/components/Form/FormPasswordInput";
import FormTextInput from "@/components/Form/FormTextInput";
import Link from "next/link";

// Validation schemas
import { AuthSignInFields, AuthSignInSchema } from "@/zod/auth";

// Forms
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

export default function AuthSignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthSignInFields>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(AuthSignInSchema),
  });

  // todo: connect with API and send actual request
  const handleSignIn: SubmitHandler<AuthSignInFields> = (credentials) => {
    console.log("CREDENTIALS: ", credentials);
  };

  return (
    <form onSubmit={handleSubmit(handleSignIn)} autoComplete="">
      <FormTextInput
        register={register("email")}
        error={errors.email}
        placeholder="your@email.com"
        autoComplete="new-password"
      />
      <FormPasswordInput
        register={register("password")}
        error={errors.password}
        modifierClass="mb-8"
      />

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

      <div className="flex justify-between items-center text-slate-400 text-xs">
        <Link
          className="hover:text-blue-400 duration-200"
          href="/auth/forgot-password"
        >
          Forgot Password?
        </Link>
        <Link className="hover:text-blue-400 duration-200" href="/auth/signup">
          No Account? Sign Up
        </Link>
      </div>
    </form>
  );
}
