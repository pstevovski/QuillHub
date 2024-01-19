"use client";

// Utilities & Hooks
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import handleErrorMessage from "@/utils/handleErrorMessage";
import fetchHandler from "@/utils/fetchHandler";

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
import FormCheckbox from "@/components/Form/FormCheckbox";

// Assets
import { FaCircleInfo as InfoIcon } from "react-icons/fa6";
import Tooltip from "@/components/Tooltips/Tooltip";

export default function AuthSignInForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthSignInFields>({
    defaultValues: { email: "", password: "", remember_me: false },
    resolver: zodResolver(AuthSignInSchema),
  });

  const handleSignIn: SubmitHandler<AuthSignInFields> = async (details) => {
    try {
      await fetchHandler("POST", "auth/signin", details);

      router.push("/protected");
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSignIn)} autoComplete="">
      <FormTextInput
        register={register("email")}
        error={errors.email}
        placeholder="your@email.com"
        autoComplete="email"
      />
      <FormPasswordInput
        register={register("password")}
        error={errors.password}
        autoComplete="current-password"
      />

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
