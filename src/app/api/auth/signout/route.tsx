import AuthService from "@/services/authentication";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await AuthService.signOut();
  } catch (error) {
    return NextResponse.json(
      { error: handleErrorMessage(error) },
      { status: 400 }
    );
  }

  redirect("/auth/signin");
}
