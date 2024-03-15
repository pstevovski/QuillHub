import UploadService from "@/services/uploads";
import { NextResponse } from "next/server";
import { handleApiErrorResponse } from "../../handleApiError";

export async function DELETE(request: Request) {
  try {
    const { keys } = await request.json();
    await UploadService.deleteUploadedFiles(keys);
    return NextResponse.json(
      { message: "Successfully removed images from Uploadthing servers" },
      { status: 200 }
    );
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
