import TopicsService from "@/services/topics";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { VALIDATION_SCHEMA_TOPICS } from "@/zod/topics";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validateTopicPayload = VALIDATION_SCHEMA_TOPICS.safeParse({
      name: payload.name,
    });

    if (!validateTopicPayload.success) {
      return NextResponse.json(
        { error: "Invalid values provided!" },
        { status: 422 }
      );
    }

    await TopicsService.createTopic(payload.name);

    return NextResponse.json({ message: "Topic created!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: handleErrorMessage(error) },
      { status: 500 }
    );
  }
}
