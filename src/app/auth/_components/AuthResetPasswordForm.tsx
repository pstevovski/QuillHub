"use client";

// Utilities & Hooks
import { toast } from "sonner";
import handleErrorMessage from "@/utils/handleErrorMessage";
import fetchHandler from "@/utils/fetchHandler";

// Components
import Button from "@/components/Buttons/Button";
import Link from "next/link";
import FormPasswordInput from "@/components/Form/FormPasswordInput";

// Validation schemas
import { AuthResetPasswordFields, AuthResetPasswordSchema } from "@/zod/auth";

// Forms
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

// TODO: Delete
export default function AuthResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthResetPasswordFields>({
    defaultValues: { token: token, password: "", confirm_password: "" },
    resolver: zodResolver(AuthResetPasswordSchema),
  });

  const handleResetPassword: SubmitHandler<AuthResetPasswordFields> = async (
    payload
  ) => {
    try {
      const data = await fetchHandler("POST", "auth/reset-password", payload);
      setTimeout(() => {
        toast.success(`${data.message}! You will be redirected shortly.`);
        router.push("/auth/signin");
      }, 2000);
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
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
