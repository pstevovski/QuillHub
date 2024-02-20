"use client";

// Hooks
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Types
import type { UserNoPassword } from "@/db/schema/users";

// Components
import { ModalAuth } from "@/components/Modals/ModalAuth";
import { AnimatePresence } from "framer-motion";
import AccountMenu from "./AccountMenu";

export default function UserMenu({ user }: { user: UserNoPassword | null }) {
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

    // Clear out any of the URL parameters
    setTimeout(() => router.replace(window.location.pathname), 1000);
  };

  useEffect(() => {
    if (!modalSearchParam) return;
    setIsAuthModalOpen(true);
  }, [modalSearchParam]);

  return (
    <>
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
