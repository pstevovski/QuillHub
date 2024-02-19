import handleErrorMessage from "@/utils/handleErrorMessage";
import { NextResponse } from "next/server";

export enum ApiErrorMessage {
  INVALID_CREDENTIALS = "Invalid Credentials!",
  BAD_REQUEST = "Bad Request",
  UNAUTHENTICATED = "Unauthenticated request",
  UNAUTHORIZED = "Unauthorized request",
  NOT_FOUND = "Requested resource was not found",
  NOT_ALLOWED = "Method not allowed",
  INVALID_VALUES = "Invalid form values",
}

/**
 *
 * Construct the API Error response based on the message
 * that was used when throwing the error.
 *
 * Based on the received message, use the correct `statusCode` value.
 *
 * @returns `NextResponse` to be thrown by the route handler.
 *
 */
export function handleApiErrorResponse(error: unknown): NextResponse {
  const receivedMessage: string = handleErrorMessage(error);
  let statusCode: number = 500;

  switch (receivedMessage) {
    case ApiErrorMessage.INVALID_CREDENTIALS || ApiErrorMessage.BAD_REQUEST:
      statusCode = 400;
      break;
    case ApiErrorMessage.UNAUTHENTICATED:
      statusCode = 401;
      break;
    case ApiErrorMessage.UNAUTHORIZED:
      statusCode = 403;
      break;
    case ApiErrorMessage.NOT_FOUND:
      statusCode = 404;
      break;
    case ApiErrorMessage.NOT_ALLOWED:
      statusCode = 405;
      break;
    case ApiErrorMessage.INVALID_VALUES:
      statusCode = 422;
      break;
    default:
      statusCode = 500;
  }

  return NextResponse.json(
    {
      error:
        statusCode !== 500
          ? receivedMessage
          : "Server Error - Something went wrong",
    },
    { status: statusCode }
  );
}
