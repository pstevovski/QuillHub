import TokenService from "@/services/token";
import TopicsService from "@/services/topics";
import handleErrorMessage from "@/utils/handleErrorMessage";
import {
  VALIDATION_SCHEMA_TOPICS,
  VALIDATION_SCHEMA_TOPICS_BULK_DELETE,
} from "@/zod/topics";
import { NextResponse } from "next/server";

/**
 *
 * Get the list of all existing topics
 *
 */
export async function GET() {
  try {
    const topics = await TopicsService.getAll();

    if (!topics || !topics.length) {
      return NextResponse.json({ error: "No topics found!" }, { status: 404 });
    }

    return NextResponse.json(topics, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: handleErrorMessage(error) },
      { status: 500 }
    );
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
    const isPayloadValid = VALIDATION_SCHEMA_TOPICS.safeParse({
      name: payload.name,
    });

    if (!isPayloadValid.success) {
      return NextResponse.json(
        { error: "Invalid values provided!" },
        { status: 422 }
      );
    }

    // Get the ID of the currently logged in user
    // Note: This will become repetitive, find solution
    const tokenDetails = await TokenService.decodeToken();

    if (!tokenDetails) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    await TopicsService.createTopic(tokenDetails.id as number, payload.name);

    return NextResponse.json({ message: "Topic created!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: handleErrorMessage(error) },
      { status: 500 }
    );
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
    const isPayloadValid = VALIDATION_SCHEMA_TOPICS_BULK_DELETE.safeParse({
      ids: payload.ids,
    });

    if (!isPayloadValid.success) {
      return NextResponse.json({ error: "Invalid values!" }, { status: 422 });
    }

    await TopicsService.deleteBulk(payload.ids);

    return NextResponse.json(
      { message: `Successfully deleted ${payload.ids.length} topics!` },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "500 - Server Error - Something went wrong!",
      handleErrorMessage(error)
    );
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
