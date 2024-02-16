import TopicsService from "@/services/topics";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const topic = await TopicsService.getSpecifc(params.id);

    if (!topic) {
      return NextResponse.json({ error: "Topic not found!" }, { status: 404 });
    }

    return NextResponse.json(topic, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: handleErrorMessage(error) },
      { status: 500 }
    );
  }
}
