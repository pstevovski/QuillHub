import TokenService from "@/services/token";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const refreshedToken = await TokenService.refreshToken();
    return NextResponse.json({ expiresTime: refreshedToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: handleErrorMessage(error) },
      { status: 500 }
    );
  }
}
