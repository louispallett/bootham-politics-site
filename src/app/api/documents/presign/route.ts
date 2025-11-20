import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { s3Client } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    // ---------------------------
    // 1. AUTHENTICATE USER
    // ---------------------------
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 },
      );
    }

    let userId: string;
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      userId = decoded.userId;
    } catch (err) {
      console.error("JWT Verification failed:", err);
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 },
      );
    }

    // ---------------------------
    // 2. VALIDATE INPUT
    // ---------------------------
    const { postId, filename, mimeType, size } = await req.json();

    if (!postId || !ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
    }

    if (!filename || !mimeType) {
      return NextResponse.json(
        { error: "filename and mimeType are required" },
        { status: 400 },
      );
    }

    // ---------------------------
    // 3. GENERATE S3 KEY
    // ---------------------------
    const fileExt = filename.split(".").pop();
    const s3Key = `documents/${postId}/${uuid()}.${fileExt}`;

    // ---------------------------
    // 4. GENERATE PRESIGNED URL
    // ---------------------------
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60, // 60 seconds
    });

    // ---------------------------
    // 5. RETURN INFO
    // ---------------------------
    return NextResponse.json({
      uploadUrl,
      s3Key,
      bucket: process.env.S3_BUCKET_NAME!,
      uploader: userId,
      mimeType,
      originalName: filename,
      size,
    });
  } catch (err: any) {
    console.error("Presign error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
