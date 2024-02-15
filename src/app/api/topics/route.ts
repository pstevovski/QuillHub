import handleErrorMessage from "@/utils/handleErrorMessage";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const topicPayload = await request.json();

    // Based on the label text we generate the unique name
    // If unique name already exists; throw error
    // If the provided label has spaces (e.g. Web Development) then
    // generated name will be "web-development"
    const generateNameFromLabel: string = topicPayload.label
      .split(" ")
      .join("-")
      .toLowerCase();

    console.log({ label: topicPayload.label, name: generateNameFromLabel });

    return NextResponse.json({ message: "Topic created!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: handleErrorMessage(error) },
      { status: 500 }
    );
  }
}
