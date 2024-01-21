"use client";

import { JWTPayload } from "jose";
import Link from "next/link";
import { useState } from "react";
import { RiQuillPenLine as QuillHubLogo } from "react-icons/ri";
import { ModalAuth } from "../Modals/ModalAuth";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import AccountMenu from "@/app/(main)/_components/AccountMenu";

export default function Header({
  userToken,
}: {
  userToken: JWTPayload | undefined;
}) {
  const searchParams = useSearchParams();
  const passwordResetToken = searchParams.get("passwordResetToken");

  // Automatically open the modal if necessary search param is present
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    return !!passwordResetToken;
  });

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

        {userToken ? (
          <AccountMenu />
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
        {!userToken && isAuthModalOpen ? (
          <ModalAuth
            passwordResetToken={passwordResetToken}
            handleModalClose={() => setIsAuthModalOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
