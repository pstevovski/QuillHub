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
      <hr className="border-none sticky top-[76px] max-w-screen-2xl mx-auto w-full h-[1px] bg-gradient-to-r from-white via-slate-200 to-white mb-6" />

      <main className="container mx-auto max-w-screen-2xl ">{children}</main>

      <footer className="max-w-screen-2xl w-full mx-auto p-4 flex flex-col justify-center items-center">
        <hr className="border-none w-full h-[1px] bg-gradient-to-r from-white via-slate-200 to-white mb-6" />
        <Link href="/" className="flex items-center text-teal-500 group">
          <span className="mr-2">&copy;</span>
          QuillHub, {new Date().getFullYear()}
        </Link>
      </footer>
    </>
  );
}
