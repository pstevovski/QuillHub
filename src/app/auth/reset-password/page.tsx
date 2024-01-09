// Components
import Link from "next/link";
import AuthResetPasswordForm from "../_components/AuthResetPasswordForm";

export default function AuthResetPasswordPage({
  searchParams,
}: {
  searchParams?: { token?: string };
}) {
  if (!searchParams || !searchParams.token) {
    return (
      <div className="w-full">
        <h1 className="text-center">
          Invalid or missing password reset token!
        </h1>
        <p className="text-center mb-6">
          Please double check the email link that you received.
        </p>

        <div className="flex justify-center">
          <Link
            className=" text-slate-400 text-sm hover:text-slate-600 duration-200"
            href="/auth/signin"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-center text-3xl font-semibold mb-2">
        Reset Password
      </h1>
      <p className="text-center mb-5">
        Please provide your new password that will be used to <br /> sign in
        into the application
      </p>

      <AuthResetPasswordForm token={searchParams.token} />
    </div>
  );
}
