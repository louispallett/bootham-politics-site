import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { s3Client } from "@/lib/s3";
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
  filename: z
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

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
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

    const { postId, filename, mimeType, size } = parsed.data;

    // ----------------------------------------
    // EXTRA SAFETY: Validate mime ↔ extension
    // ----------------------------------------
    const fileExt = filename.split(".").pop()?.toLowerCase();

    if (!fileExt) {
      return NextResponse.json(
        { error: "Missing file extension" },
        { status: 400 },
      );
    }

    const mimeMismatch =
      (fileExt === "pdf" && mimeType !== "application/pdf") ||
      (["doc"].includes(fileExt) && mimeType !== "application/msword") ||
      (["docx"].includes(fileExt) &&
        mimeType !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
      (["xls"].includes(fileExt) && mimeType !== "application/vnd.ms-excel") ||
      (["xlsx"].includes(fileExt) &&
        mimeType !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
      (["ppt"].includes(fileExt) &&
        mimeType !== "application/vnd.ms-powerpoint") ||
      (["pptx"].includes(fileExt) &&
        mimeType !==
          "application/vnd.openxmlformats-officedocument.presentationml.presentation");

    if (mimeMismatch) {
      return NextResponse.json(
        { error: "File extension does not match MIME type" },
        { status: 400 },
      );
    }

    // ---------------------------
    // 3. GENERATE S3 KEY
    // ---------------------------
    const s3Key = `documents/${postId}/${uuid()}.${fileExt}`;

    // ---------------------------
    // 4. GENERATE PRESIGNED URL
    // ---------------------------
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
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
