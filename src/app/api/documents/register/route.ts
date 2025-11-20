import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import Document from "@/models/Document";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    // ---------------------------
    // 1. AUTHENTICATE USER
    // ---------------------------
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 },
      );
    }

    let userId: string;
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      userId = decoded.userId;
    } catch {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 },
      );
    }

    // ---------------------------
    // 2. VALIDATE INPUT
    // ---------------------------
    const { postId, s3Key, bucket, originalName, mimeType, size } =
      await req.json();

    if (!ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
    }

    if (!s3Key || !bucket || !originalName || !mimeType) {
      return NextResponse.json(
        { error: "Missing required metadata" },
        { status: 400 },
      );
    }

    // ---------------------------
    // 3. SAVE DOC IN DB
    // ---------------------------
    const newDoc = await Document.create({
      postId: new ObjectId(postId),
      uploader: new ObjectId(userId),
      originalName,
      mimeType,
      size,
      s3Key,
      s3Bucket: bucket,
    });

    return NextResponse.json({ success: true, document: newDoc });
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
