"use client";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
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

  // todo: connect with API and send actual request
  // todo: extract fetch logic into utility function
  // todo: configure the API URL to be used based on ENV
  const handleSignUp: SubmitHandler<AuthSignUpFields> = async (newUser) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert("User successfully created");
    } catch (error: any) {
      alert(error.message);
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

      <Button type="submit" variant="primary" size="full" modifierClass="mb-4">
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
