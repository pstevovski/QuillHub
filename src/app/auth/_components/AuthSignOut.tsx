"use client";

import Button from "@/components/Buttons/Button";
import fetchHandler from "@/utils/fetchHandler";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { toast } from "sonner";

export default function AuthSignOut() {
  const handleSignOut = async () => {
    try {
      await fetchHandler("POST", "auth/signout", undefined);
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
  };

  return (
    <Button type="button" handleOnClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
