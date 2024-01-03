export default function AuthResetPasswordPage({
  searchParams,
}: {
  searchParams?: { token?: string };
}) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-semibold mb-2">Reset Password</h1>
      <p>
        Please provide your new password that will be used to <br /> sign in
        into the application
      </p>
      <p>Your password reset token: {searchParams?.token || "N/A"}</p>
    </div>
  );
}
