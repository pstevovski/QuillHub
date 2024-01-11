import AuthService from "@/services/authentication";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await AuthService.signOut();
    return NextResponse.json({ message: "User signed out" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: handleErrorMessage(error) },
      { status: 400 }
    );
  }
}
