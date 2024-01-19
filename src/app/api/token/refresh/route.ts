import TokenService from "@/services/token";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { token, expires } = await TokenService.refreshAccessToken(
      payload?.refreshToken
    );

    return NextResponse.json({ token, expires }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: handleErrorMessage(error) },
      { status: 500 }
    );
  }
}
