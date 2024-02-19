import TokenService from "@/services/token";
import TopicsService from "@/services/topics";
import {
  VALIDATION_SCHEMA_TOPICS,
  VALIDATION_SCHEMA_TOPICS_BULK_DELETE,
} from "@/zod/topics";
import { NextResponse } from "next/server";
import { handleApiErrorResponse } from "../handleApiError";
import { handlePayloadValidation } from "../handlePayloadValidation";

/**
 *
 * Get the list of all existing topics
 *
 */
export async function GET() {
  try {
    const topics = await TopicsService.getAll();
    return NextResponse.json(topics, { status: 200 });
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}

/**
 *
 * Create a new topic
 *
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Check if the received payload passes validation schema
    await handlePayloadValidation(VALIDATION_SCHEMA_TOPICS, payload);

    // Get the ID of the currently logged in user
    // Note: This will become repetitive, find solution
    // TODO: Remove this, handle within method
    const tokenDetails = await TokenService.decodeToken();

    if (!tokenDetails) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    await TopicsService.create(tokenDetails.id as number, payload.name);

    return NextResponse.json({ message: "Topic created!" }, { status: 200 });
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}

/**
 *
 * Delete multiple topics at once
 *
 */
export async function DELETE(request: Request) {
  try {
    const payload = await request.json();

    // Validate the payload
    await handlePayloadValidation(
      VALIDATION_SCHEMA_TOPICS_BULK_DELETE,
      payload
    );

    await TopicsService.deleteBulk(payload.ids);

    return NextResponse.json(
      { message: `Successfully deleted ${payload.ids.length} topics!` },
      { status: 200 }
    );
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
