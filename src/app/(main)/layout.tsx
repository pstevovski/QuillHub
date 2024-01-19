import TokenService from "@/services/token";
import Link from "next/link";
import AuthSignOut from "../auth/_components/AuthSignOut";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the currently logged in user from the database
  const token = await TokenService.decodeToken();
  console.log("token", token);

  return (
    <>
      <header className="py-6 w-full bg-red-200">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <Link href="/">Quillhub</Link>

          {token ? (
            <AuthSignOut authenticatedUser={token} />
          ) : (
            <Link href="/auth/signin">Sign In</Link>
          )}
        </div>
      </header>

      <main className="container mx-auto max-w-screen-xl">{children}</main>
    </>
  );
}
