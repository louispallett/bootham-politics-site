import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Document from "@/models/Document";
import { ObjectId } from "mongodb";
import { getPresignedDownloadUrl } from "@/lib/s3";

export async function GET(
  req: NextRequest,
  { params }: { params: { documentId: string } },
) {
  try {
    await connectToDB();

    const documentId = params.documentId;

    if (!ObjectId.isValid(documentId)) {
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 },
      );
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    const url = await getPresignedDownloadUrl(
      document.s3Bucket,
      document.s3Key,
    );

    return NextResponse.json({ url }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
