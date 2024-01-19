"use client";

// Utilities & Hooks
import { toast } from "sonner";
import fetchHandler from "@/utils/fetchHandler";
import handleErrorMessage from "@/utils/handleErrorMessage";

// Components
import Button from "@/components/Buttons/Button";
import { JWTPayload } from "jose";

export default function AuthSignOut({
  authenticatedUser,
}: {
  authenticatedUser: JWTPayload | undefined;
}) {
  const handleSignOut = async () => {
    try {
      await fetchHandler("POST", "auth/signout", undefined);

      // note: this is a "hacky" solution to
      // be able to clear out the received details for the authenticated user
      window.location.replace("/auth/signin");
    } catch (error) {
      toast.error(handleErrorMessage(error));
    }
  };

  return (
    <div>
      <p>User is {authenticatedUser?.role_id === 2 ? "Admin" : "Regular"}</p>
      <Button type="button" handleOnClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
}
