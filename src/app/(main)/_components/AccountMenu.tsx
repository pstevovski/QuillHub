"use client";

// Utilities & Hooks
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { handleCheckIfProtectedRoute } from "@/utils/protectedRoutes";
import fetchHandler from "@/utils/fetchHandler";
import handleErrorMessage from "@/utils/handleErrorMessage";
import getNameInitials from "@/utils/initials";

// Assets
import {
  FaChevronDown as ChevronIcon,
  FaUser as MenuProfileIcon,
} from "react-icons/fa";
import {
  MdQueryStats as MenuStatsIcon,
  MdLogout as MenuSignOutIcon,
} from "react-icons/md";
import {
  IoBookmarks as MenuBookmarksIcon,
  IoSettings as MenuSettingsIcon,
} from "react-icons/io5";

// Components
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Types
import type { User } from "@/db/schema/users";

export default function AccountMenu({ userDetails }: { userDetails: User }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Sign out the user
  const handleSignOut = async () => {
    try {
      await fetchHandler("POST", "auth/signout", undefined);

      // Check if the current route is protected
      // If so, redirect the user to the homepage, otherwise stay on same page
      const currentRoute = window.location.pathname;

      if (handleCheckIfProtectedRoute(currentRoute)) router.replace("/");

      router.refresh();
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
  };

  return (
    <div className="relative">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {/* avatar */}
        <div className="flex justify-center items-center shrink-0 h-8 w-8 rounded-full bg-slate-200">
          {userDetails.profile_picture ? (
            <Image
              className="h-8 w-8 rounded-full bg-slate-200"
              src={userDetails.profile_picture}
              alt="test"
            />
          ) : (
            <span className="text-xs text-slate-500 font-medium">
              {getNameInitials(userDetails.first_name, userDetails.last_name)}
            </span>
          )}
        </div>

        {/* username */}
        <div className="flex items-center">
          <h5 className="max-w-[200px] w-full text-sm text-slate-400 truncate ml-2">
            Hi, {userDetails.first_name}
          </h5>
          <ChevronIcon className="text-slate-400 ml-2 text-xs" />
        </div>
      </div>

      {/* dropdown menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="account-menu"
            className="absolute top-[calc(100%+15px)] left-0 border w-[250px] rounded-md [&>*]:cursor-pointer"
            initial={{ opacity: 0, translateY: "-15px" }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: "-15px" }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
          >
            <Link
              className="flex items-center text-slate-400 hover:text-teal-500 bg-white hover:bg-slate-100 duration-300 px-4 py-3 rounded-tl-md rounded-tr-md"
              href="/account/profile"
            >
              <MenuProfileIcon className="mr-3 text-xl" />
              My Profile
            </Link>
            <Link
              className="flex items-center text-slate-400 hover:text-teal-500 bg-white hover:bg-slate-100 duration-300 px-4 py-3"
              href="/account/stats"
            >
              <MenuStatsIcon className="mr-3 text-xl" />
              Stats
            </Link>
            <Link
              className="flex items-center text-slate-400 hover:text-teal-500 bg-white hover:bg-slate-100 duration-300 px-4 py-3"
              href="/bookmarks"
            >
              <MenuBookmarksIcon className="mr-3 text-xl" />
              Bookmarks
            </Link>
            <hr />
            <Link
              className="flex items-center text-slate-400 hover:text-teal-500 bg-white hover:bg-slate-100 duration-300 px-4 py-3"
              href="/account/settings"
            >
              <MenuSettingsIcon className="mr-3 text-xl" />
              Settings
            </Link>

            <hr />

            <button
              onClick={handleSignOut}
              className="flex items-center w-full text-slate-400 hover:text-teal-500  bg-white hover:bg-slate-100 rounded-bl-md rounded-br-md duration-300 px-4 py-3"
            >
              <MenuSignOutIcon className="mr-3 text-xl" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
