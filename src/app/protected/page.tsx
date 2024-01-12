import TokenService from "@/services/token";
import AuthSignOut from "../auth/_components/AuthSignOut";

export default async function TestPage() {
  const authenticatedUser = await TokenService.decodeToken();
  return (
    <div>
      <h1>Protected page</h1>
      <AuthSignOut authenticatedUser={authenticatedUser} />
    </div>
  );
}
