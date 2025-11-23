import { connectToDB } from "./db";
import Document from "@/models/Document";
import { DocumentType } from "./types";

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
  await connectToDB();

  const documents = await Document.find({ postId });

  return documents;
}
