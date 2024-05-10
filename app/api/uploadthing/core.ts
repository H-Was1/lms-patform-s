import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { utapi } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();

  if (!userId) throw new Error("Unauthorized");
  return { userId };
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadError(async (error) => {
      console.error("[UPLOADTHING]", error);
      await utapi.deleteFiles(error.fileKey);
    })
    .onUploadComplete(() => {}),
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadError(async (error) => {
      console.error("[UPLOADTHING]", error);
      await utapi.deleteFiles(error.fileKey);
    })
    .onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
    .middleware(() => handleAuth())
    .onUploadError(async (error) => {
      console.error("[UPLOADTHING]", error);
      await utapi.deleteFiles(error.fileKey);
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
