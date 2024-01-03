"use client";

// Components
import Button from "@/components/Buttons/Button";
import FormPasswordInput from "@/components/Form/FormPasswordInput";
import FormTextInput from "@/components/Form/FormTextInput";

// Validation schemas
import { AuthSignInFields, AuthSignInSchema } from "@/zod/auth";

// Forms
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

export default function AuthSignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
      />

      <Button type="submit" variant="primary" size="full">
        Sign In
      </Button>
    </form>
  );
}
