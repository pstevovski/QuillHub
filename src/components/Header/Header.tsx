"use client";

// Hooks
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Assets
import { RiQuillPenLine as QuillHubLogo } from "react-icons/ri";

// Components
import { AnimatePresence } from "framer-motion";
import { ModalAuth } from "../Modals/ModalAuth";
import Link from "next/link";
import AccountMenu from "@/app/(main)/_components/AccountMenu";

// Types
import type { User } from "@/db/schema/users";

export default function Header({ user }: { user: User | null }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const passwordToken = searchParams.get("password_token");
  const modalSearchParam = searchParams.get("modal");

  // Automatically open the modal if necessary search param is present
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    return Boolean(modalSearchParam || passwordToken);
  });

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);

    // Clear out any of the search parameters that could potentially exist
    router.replace(window.location.pathname);
  };

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

        {user ? (
          <AccountMenu userDetails={user} />
        ) : (
          <span
            className="text-slate-400 hover:text-teal-500 duration-300 cursor-pointer"
            onClick={() => setIsAuthModalOpen(!isAuthModalOpen)}
          >
            Sign In
          </span>
        )}
      </header>
      <hr className="border-none sticky top-[76px] max-w-screen-2xl mx-auto w-full h-[1px] bg-gradient-to-r from-white via-slate-200 to-white mb-6" />

      <AnimatePresence>
        {!user && isAuthModalOpen ? (
          <ModalAuth
            passwordToken={passwordToken}
            handleModalClose={handleCloseAuthModal}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
