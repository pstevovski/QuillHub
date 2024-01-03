import { z } from "zod";

/*====================================
  AUTHENTICATION: SIGN IN FORM
=====================================*/
export const AuthSignInSchema = z.object({
  email: z
    .string({ required_error: "Please enter your email address" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string({ required_error: "Please enter your password" })
    .min(1, "Please enter your password"),
});

export type AuthSignInFields = z.infer<typeof AuthSignInSchema>;
