import UploadService from "@/services/uploads";
import handleErrorMessage from "@/utils/handleErrorMessage";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { keys } = await request.json();
    await UploadService.deleteImagesFromUploadthing(keys);
    return NextResponse.json(
      { message: "Successfully removed images from Uploadthing servers" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: handleErrorMessage(error) },
      { status: 500 }
    );
  }
}
