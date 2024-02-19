import { z } from "zod";

/*====================================
  AUTHENTICATION: SIGN IN FORM
=====================================*/
export const VALIDATION_SCHEMA_AUTH_SIGNIN = z.object({
  email: z
    .string({ required_error: "Please enter your email address" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string({ required_error: "Please enter your password" })
    .min(1, "Please enter your password"),
  remember_me: z.boolean(),
});

export type AuthSignInFields = z.infer<typeof VALIDATION_SCHEMA_AUTH_SIGNIN>;

/*====================================
  AUTHENTICATION: SIGN UP FORM
=====================================*/
export const VALIDATION_SCHEMA_AUTH_SIGNUP = z
  .object({
    email: z
      .string({ required_error: "Please enter your email address" })
      .email({ message: "Please enter a valid email address" }),
    first_name: z
      .string({ required_error: "Please enter your first name" })
      .min(1, "Please enter your first name"),
    last_name: z
      .string({ required_error: "Please enter your last name" })
      .min(1, "Please enter your last name"),
    password: z
      .string({ required_error: "Please enter your password" })
      .min(6, "Password must be at least 6 characters long!"),
    confirm_password: z
      .string({ required_error: "Please confirm your password" })
      .min(6, "Password must be at least 6 characters long!"),
  })
  .refine(
    (userDetails) => userDetails.password === userDetails.confirm_password,
    {
      message: "Passwords do not match!",
      path: ["confirm_password"],
    }
  );

export type AuthSignUpFields = z.infer<typeof VALIDATION_SCHEMA_AUTH_SIGNUP>;

/*====================================
  AUTHENTICATION: FORGOT PASSWORD FORM
=====================================*/
export const VALIDATION_SCHEMA_AUTH_FORGOT_PASSWORD = z.object({
  email: z
    .string({ required_error: "Please enter your email address " })
    .email({ message: "Please enter a valid email address" }),
});

export type AuthForgotPasswordFields = z.infer<
  typeof VALIDATION_SCHEMA_AUTH_FORGOT_PASSWORD
>;

/*====================================
  AUTHENTICATION: RESET PASSWORD FORM
=====================================*/
export const VALIDATION_SCHEMA_AUTH_RESET_PASSWORD = z
  .object({
    token: z.string({
      required_error: "Please provide a valid password reset token",
    }),
    password: z
      .string({ required_error: "Please enter your password" })
      .min(6, "Password must be at least 6 characters long!"),
    confirm_password: z
      .string({ required_error: "Please confirm your password" })
      .min(6, "Password must be at least 6 characters long!"),
  })
  .refine(
    (userDetails) => userDetails.password === userDetails.confirm_password,
    {
      message: "Passwords do not match!",
      path: ["confirm_password"],
    }
  );

export type AuthResetPasswordFields = z.infer<
  typeof VALIDATION_SCHEMA_AUTH_RESET_PASSWORD
>;
