import TokenService from "@/services/token";
import { cookies } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const uploadThing = createUploadthing();

export const appFileRouter = {
  blogPostCoverPhoto: uploadThing({
    image: { maxFileCount: 1, maxFileSize: "4MB" },
  })
    .middleware(async () => {
      // Verify that the user has a token and its valid
      const accessToken = cookies().get(TokenService.ACCESS_TOKEN_NAME)?.value;
      if (!accessToken) throw new UploadThingError("Unauthenticated!");

      const verifiedAccessToken = await TokenService.verifyToken(accessToken);
      if (!verifiedAccessToken) throw new UploadThingError("Unauthenticated!");

      // Available under "metadata" when upload is completed
      return { userId: verifiedAccessToken.id as number };
    })
    .onUploadComplete(async ({ file }) => {
      // Gets sent back to the client for "onClientUploadComplete" callback
      return { file };
    }),
  blogPostAttchedImage: uploadThing({
    image: { maxFileCount: 1, maxFileSize: "4MB" },
  })
    .middleware(async () => {
      // Verify that the user has a token and its valid
      const accessToken = cookies().get(TokenService.ACCESS_TOKEN_NAME)?.value;
      if (!accessToken) throw new UploadThingError("Unauthenticated!");

      const verifiedAccessToken = await TokenService.verifyToken(accessToken);
      if (!verifiedAccessToken) throw new UploadThingError("Unauthenticated!");

      // Available under "metadata" when upload is completed
      return { userId: verifiedAccessToken.id as number };
    })
    .onUploadComplete(async ({ file }) => {
      // Gets sent back to the client for "onClientUploadComplete" callback
      return { file };
    }),
} satisfies FileRouter;

export type UploadThingFileRouter = typeof appFileRouter;
