import TokenService from "@/services/token";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // If the payload contains a "refreshToken" value, then the request  originates from the "middleware"
    // If it does not contain that value, then the request originates from the client and it
    // should read the cookies that were sent from the browser with the request
    const payload = await request.json();
    const cookieRefreshToken = cookies().get(
      TokenService.REFRESH_TOKEN_NAME
    )?.value;

    const { token, expires } = await TokenService.refreshAccessToken(
      payload?.refreshToken || cookieRefreshToken
    );

    return NextResponse.json({ token, expires }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: handleErrorMessage(error) },
      { status: 500 }
    );
  }
}
