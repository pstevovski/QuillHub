import AuthSignInForm from "../_components/AuthSignInForm";

export default function AuthSignInPage() {
  return (
    <div className="w-full">
      <h1 className="text-center text-3xl font-semibold mb-2">Sign In</h1>
      <p className="text-center mb-5">
        Sign in to access all features of the application
      </p>

      <AuthSignInForm />
    </div>
  );
}
