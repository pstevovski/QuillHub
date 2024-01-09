"use client";

// Utilities & Hooks
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import fetchHandler from "@/utils/fetchHandler";
import handleErrorMessage from "@/utils/handleErrorMessage";

// Components
import Button from "@/components/Buttons/Button";
import FormPasswordInput from "@/components/Form/FormPasswordInput";
import FormTextInput from "@/components/Form/FormTextInput";
import Link from "next/link";

// Validation schemas
import { AuthSignUpFields, AuthSignUpSchema } from "@/zod/auth";

// Forms
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

export default function AuthSignUpForm() {
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
      const data = await fetchHandler("POST", "auth/signup", newUser);
      toast.success(data.message);

      // Redirect to login page
      setTimeout(() => router.push("/auth/signin"), 1000);
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSignUp)} autoComplete="">
      <FormTextInput
        register={register("email")}
        error={errors.email}
        placeholder="your@email.com"
        autoComplete="new-password"
      />
      <FormTextInput
        register={register("first_name")}
        error={errors.first_name}
        placeholder="John"
        autoComplete="new-password"
      />
      <FormTextInput
        register={register("last_name")}
        error={errors.last_name}
        placeholder="Doe"
        autoComplete="new-password"
      />
      <FormPasswordInput
        register={register("password")}
        error={errors.password}
        modifierClass="mb-8"
      />
      <FormPasswordInput
        register={register("confirm_password")}
        error={errors.confirm_password}
        modifierClass="mb-8"
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
