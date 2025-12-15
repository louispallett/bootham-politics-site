import { connectToDB } from "@/lib/db";
import { ObjectId } from "mongodb";
import HttpError from "@/lib/HttpError";
import Document from "@/models/Document";
import { NextRequest, NextResponse } from "next/server";
import { getPresignedDownloadUrl } from "@/lib/s3";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    await connectToDB();

    const { postId } = await params;

    if (!ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const documents = await Document.find({ postId }).lean();
    if (!documents) {
      throw new HttpError("Error fetching documents", 500);
    }

    for (const document of documents) {
      const url = await getPresignedDownloadUrl(
        document.s3Bucket,
        document.s3Key,
      );
      document.url = url;

      delete document.s3Bucket;
      delete document.s3Key;
    }

    return NextResponse.json(documents);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}
