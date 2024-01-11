"use client";

// Utilities & Hooks
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import fetchHandler from "@/utils/fetchHandler";
import handleErrorMessage from "@/utils/handleErrorMessage";

// Components
import Button from "@/components/Buttons/Button";

export default function AuthSignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetchHandler("POST", "auth/signout", undefined);
      router.push("/auth/signin");
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
