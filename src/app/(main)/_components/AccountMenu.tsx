"use client";

import Link from "next/link";
import { useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

export default function AccountMenu(userDetails: any) {
  console.log("USER DETAILS", userDetails);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {/* avatar */}
        <div className="shrink-0 h-8 w-8 rounded-full bg-slate-200"></div>

        {/* username */}
        <div className="flex items-center">
          <h5 className="max-w-[200px] w-full text-sm text-slate-400 truncate ml-2">
            Hi, FIRST_NAME
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

            <button className="flex items-center w-full text-slate-400 hover:text-teal-500  bg-white hover:bg-slate-100 duration-300 px-4 py-3">
              <MenuSignOutIcon className="mr-3 text-xl" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
