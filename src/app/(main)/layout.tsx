import TokenService from "@/services/token";
import Link from "next/link";
import AuthSignOut from "../auth/_components/AuthSignOut";
import { RiQuillPenLine as QuillHubLogo } from "react-icons/ri";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the currently logged in user from the database
  const token = await TokenService.decodeToken();

  return (
    <>
      <header className="flex justify-between items-center max-w-screen-2xl mx-auto px-10 py-6 w-full sticky top-0 bg-white">
        <Link
          href="/"
          className="flex items-center font-semibold text-lg text-teal-500 group"
        >
          QuillHub
          <QuillHubLogo className="text-2xl group-hover:rotate-[10deg] duration-300" />
        </Link>

        {token ? (
          <AuthSignOut authenticatedUser={token} />
        ) : (
          <Link href="/auth/signin">Sign In</Link>
        )}
      </header>

      <main className="container mx-auto max-w-screen-2xl ">{children}</main>
    </>
  );
}
