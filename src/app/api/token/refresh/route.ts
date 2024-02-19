import TokenService from "@/services/token";
import { NextRequest, NextResponse } from "next/server";
import { handleApiErrorResponse } from "../../handleApiError";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { token, expires } = await TokenService.refreshAccessToken(
      payload?.refreshToken
    );

    return NextResponse.json({ token, expires }, { status: 200 });
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
