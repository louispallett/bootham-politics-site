import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import Document from "@/models/Document";
import { z } from "zod";
import mongoose from "mongoose";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "../auxiliary";

const ValidationSchema = z.object({
  postId: z
    .string()
    .trim()
    .refine((v) => mongoose.Types.ObjectId.isValid(v), {
      message: "Invalid tag ID",
    }),
  s3Key: z
    .string()
    .min(10)
    .regex(
      /^documents\/[A-Za-z0-9_-]+\/[A-Za-z0-9-]{36}\.[A-Za-z0-9]+$/,
      "Invalid S3 key format",
    ),
  originalName: z
    .string()
    .trim()
    .max(1000, "Filename too long")
    .refine((name) => name.includes("."), {
      message: "File must include an extension",
    })
    .refine(
      (name) => {
        const ext = name.split(".").pop()?.toLowerCase();
        return ALLOWED_EXTENSIONS.includes(ext || "");
      },
      {
        message: "Unsupported file extension",
      },
    ),
  mimeType: z
    .string()
    .trim()
    .refine((v) => ALLOWED_MIME_TYPES.includes(v), {
      message: "Unsupported file type",
    }),
  size: z
    .number()
    .positive()
    .max(MAX_FILE_SIZE_BYTES, "File too large (max 10 MB)"),
});

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
    const body = await req.json();

    const parsed = ValidationSchema.safeParse(body);
    if (!parsed.success) {
      console.error(parsed.error.flatten().fieldErrors);
      return NextResponse.json(
        {
          message: "Validation Errors",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { postId, s3Key, originalName, mimeType, size } = parsed.data;

    // ---------------------------
    // 3. SAVE DOC IN DB
    // ---------------------------
    const newDoc = await Document.create({
      postId,
      uploader: userId,
      originalName,
      mimeType,
      size,
      s3Key,
      s3Bucket: process.env.AWS_BUCKET_NAME!,
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
