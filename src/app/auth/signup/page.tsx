import AuthSignUpForm from "../_components/AuthSignUpForm";

export default function AuthSignUpPage() {
  return (
    <div className="w-full">
      <h1 className="text-center text-3xl font-semibold mb-2">Sign Up</h1>
      <p className="text-center mb-5">Create your new account </p>

      <AuthSignUpForm />
    </div>
  );
}
