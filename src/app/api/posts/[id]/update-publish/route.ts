import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/lib/db";
import HttpError from "@/lib/HttpError";
import Post from "@/models/Post";

export async function PUT(
  req: NextRequest | Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDB();

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const updated = await Post.findByIdAndUpdate(
      id,
      [{ $set: { published: { $not: "$published" } } }],
      { new: true }, // return the updated doc
    );

    if (!updated) {
      throw new HttpError("Post not found", 404);
    }

    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}
