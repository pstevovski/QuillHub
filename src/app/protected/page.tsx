import AuthSignOut from "../auth/_components/AuthSignOut";

export default function TestPage() {
  return (
    <div>
      <h1>Protected page</h1>
      <AuthSignOut />
    </div>
  );
}
