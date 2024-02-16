import TopicsService from "@/services/topics";
import { VALIDATION_SCHEMA_TOPICS } from "@/zod/topics";
import { NextResponse } from "next/server";
import { handleApiErrorResponse } from "../../handleApiError";
import { handlePayloadValidation } from "../../handlePayloadValidation";

/**
 *
 * Get a specific topic based on ID
 *
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const topic = await TopicsService.getSpecifc(params.id);
    return NextResponse.json(topic, { status: 200 });
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}

/**
 *
 * Update a specific topic based on ID
 *
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const payload = await request.json();

    // Validate payload
    await handlePayloadValidation(VALIDATION_SCHEMA_TOPICS, payload);

    // Update the targeted topic's name
    await TopicsService.update(params.id, payload.name);

    return NextResponse.json(
      { message: "Topic name updated" },
      { status: 200 }
    );
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}

/**
 *
 * Delete a specific topic based on ID
 *
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: number } }
) {
  try {
    await TopicsService.deleteSpecific(params.id);
    return NextResponse.json({
      message: `Topic with ID ${params.id} was successfully deleted!`,
    });
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
