import { connectToDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Document from "@/models/Document";
import HttpError from "@/lib/HttpError";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDB();

    const id = await params.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const document = await Document.findById(id);

    if (!document) {
      throw new HttpError("Not found", 404);
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: document.s3Key,
      }),
    );

    await document.deleteOne();

    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: err.status || 500 },
    );
  }
}
