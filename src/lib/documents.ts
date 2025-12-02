import { connectToDB } from "./db";
import Document from "@/models/Document";
import { DocumentType } from "./types";
import HttpError from "./HttpError";
import { getPresignedDownloadUrl } from "./s3";

export async function getAllDocuments(): Promise<DocumentType[]> {
  try {
    await connectToDB();

    const documents = await Document.find();

    return documents;
  } catch (err: any) {
    console.error("Error fetching documents", err);
    throw new Error(err.message || "Server failed to fetch posts");
  }
}

export async function getDocumentsByPostId(
  postId: string,
): Promise<DocumentType[]> {
  try {
    await connectToDB();

    const documents = await Document.find({ postId }).lean();
    if (!documents) {
      throw new HttpError("Error fetching documents");
    }

    for (const document of documents) {
      const url = await getPresignedDownloadUrl(
        document.s3Bucket,
        document.s3Key,
      );
      document.url = url;
    }

    return documents;
  } catch (err: any) {
    console.error("Error fetching documents", err);
    throw new Error(err.message || "Server failed to fetch posts");
  }
}
