import AuthForgotPasswordForm from "../_components/AuthForgotPasswordForm";

export default function AuthForgotPasswordPage() {
  return (
    <div className="w-full">
      <h1 className="text-center text-3xl font-semibold mb-2">
        Forgot Password?
      </h1>
      <p className="text-center mb-5">
        Provide your email and if such account exists <br /> we'll send you a
        password reset link
      </p>

      <AuthForgotPasswordForm />
    </div>
  );
}
