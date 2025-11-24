import { connectToDB } from "@/lib/db";
import { ObjectId } from "mongodb";
import HttpError from "@/lib/HttpError";
import Document from "@/models/Document";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    await connectToDB();

    const postId = await params.postId;

    if (!ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const documents = await Document.find({ postId });
    if (!documents) {
      throw new HttpError("Error fetching documents", 500);
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
