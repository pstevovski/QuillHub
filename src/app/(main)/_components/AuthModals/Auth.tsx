import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ModalSignIn from "./SignIn";

import { IoClose as CloseIcon } from "react-icons/io5";
import ModalSignUp from "./SignUp";
import ModalForgotPassword from "./ForgotPassword";
import ModalResetPassword from "./ResetPassword";

export type ModalAuthType =
  | "sign_in"
  | "sign_up"
  | "password_forgot"
  | "password_reset";

export interface ModalAuthCommonProps {
  handleModalAuthType: (type: ModalAuthType) => void;
  handleModalClose: () => void;
}

export interface ModalAuthPasswordResetProps extends ModalAuthCommonProps {
  token: string | null;
}

export const MOTION_MODAL_CONTAINER_VARIANTS = {
  enter: {
    opacity: 0,
    x: "-50%",
    y: "-20%",
    height: 500,
  },
  animate: (modalType: ModalAuthType) => {
    let height: number = 550;
    switch (modalType) {
      case "sign_up":
        height = 770;
        break;
      case "password_forgot":
        height = 320;
        break;
      case "password_reset":
        height = 435;
        break;
    }

    return {
      opacity: 1,
      x: "-50%",
      y: "-50%",
      height: height,
    };
  },
  exit: {
    opacity: 0,
    x: "-50%",
    y: "-20%",
    height: 500,
  },
};

export function ModalAuth({
  passwordToken,
  handleModalClose,
}: {
  passwordToken: string | null;
  handleModalClose: () => void;
}) {
  const [modalType, setModalType] = useState<ModalAuthType>(() => {
    return passwordToken ? "password_reset" : "sign_in";
  });
  const handleModalAuthType = (type: ModalAuthType) => setModalType(type);

  return (
    <>
      {/* overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="z-10 fixed top-0 left-0 max-w-screen w-full h-screen bg-slate-400 opacity-30"
      ></motion.div>

      {/* content */}
      <motion.div
        className="z-10 fixed top-1/2 left-1/2 border rounded max-w-lg w-full bg-white overflow-hidden"
        custom={modalType}
        variants={MOTION_MODAL_CONTAINER_VARIANTS}
        initial="enter"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        <CloseIcon
          className="absolute top-6 right-4 z-10 text-2xl text-slate-400 hover:text-rose-500 duration-300 cursor-pointer"
          onClick={handleModalClose}
        />

        <AnimatePresence initial={false}>
          {modalType === "sign_in" ? (
            <ModalSignIn
              key="sign-in"
              handleModalAuthType={handleModalAuthType}
              handleModalClose={handleModalClose}
            />
          ) : null}

          {modalType === "sign_up" ? (
            <ModalSignUp
              key="sign-up"
              handleModalClose={handleModalClose}
              handleModalAuthType={handleModalAuthType}
            />
          ) : null}

          {modalType === "password_forgot" ? (
            <ModalForgotPassword
              key="password-forgot"
              handleModalClose={handleModalClose}
              handleModalAuthType={handleModalAuthType}
            />
          ) : null}

          {modalType === "password_reset" ? (
            <ModalResetPassword
              key="password-reset"
              token={passwordToken}
              handleModalClose={handleModalClose}
              handleModalAuthType={handleModalAuthType}
            />
          ) : null}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
