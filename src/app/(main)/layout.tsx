// Components
import UsersService from "@/services/users";
import Link from "next/link";
import UserMenu from "./_components/UserMenu";

// Assets
import { RiQuillPenLine as QuillHubLogo } from "react-icons/ri";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await UsersService.getCurrentUser();

  return (
    <>
      <header className="flex justify-between items-center max-w-screen-2xl mx-auto px-24 py-6 w-full sticky top-0 bg-white z-[9]">
        <Link
          href="/"
          className="flex items-center font-semibold text-lg text-teal-500 group"
        >
          QuillHub
          <QuillHubLogo className="text-2xl group-hover:rotate-[10deg] duration-300" />
        </Link>

        <UserMenu user={user} />
      </header>

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
